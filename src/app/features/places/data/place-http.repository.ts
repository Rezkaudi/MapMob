import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, map, shareReplay, switchMap } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CLOCK } from '../../../core/config/clock';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { LiveMetaPage, readAllMetaPages } from '../../../core/http/read-all-meta-pages';
import { LiveDeliveryPlatform } from '../../../shared/data/live-delivery-platform';
import { LiveStoreDeliveryLink } from '../../../shared/data/live-store-delivery-link';
import { LivePlan } from '../../../shared/data/live-plan';
import { PagedResult } from '../../../core/models/paged-result';
import { ActivationStatus } from '../../../shared/models/activation-status';
import { SelectOption } from '../../../shared/ui/select-field/select-option';
import { Place } from '../models/place';
import { PlaceDetail } from '../models/place-detail';
import { PlaceExportRequest } from '../models/place-export-request';
import { PlaceFormChoices } from '../models/place-form-choices';
import { PlaceSaveRequest } from '../models/place-save-request';
import { PlaceQuery } from '../models/place-query';
import { PlaceStatusCounts } from '../models/place-status-counts';
import { LiveCategory } from '../../categories/data/live-category';
import { LiveCity } from '../../regions/data/live-city';
import { LiveRegion } from '../../regions/data/live-region';
import { LivePlaceDetail } from './live-place-detail';
import { toPlaceDeliveryLinks } from './live-place-delivery-links';
import { toLivePlaceFormOptions } from './live-place-options-from-lists';
import { toPlaceFormChoices } from './live-place-choices';
import { LivePlaceFormOptions } from './live-place-form-options';
import { toPlaceDetail } from './live-place-detail-mapping';
import { toLivePlaceStatus, toPlace } from './live-place-mapping';
import { LivePlaceRow } from './live-place-row';
import { toPlaceFilterParams, toPlaceQueryParams } from './place-query-params';
import { PlaceRepository } from './place.repository';
import { PlaceWriter } from './place-writer';

// Asked for, so a list that honours it answers in one page.
const ALL_ROWS_PAGE_SIZE = 1000;

@Injectable()
export class PlaceHttpRepository implements PlaceRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly clock = inject(CLOCK);
  private readonly writer = inject(PlaceWriter);
  private readonly adminUrl = `${inject(API_BASE_URL)}/admin`;
  private readonly storesUrl = `${this.adminUrl}/stores`;
  // Rows and filters name plans by slug, so the plans are read once per page visit.
  private readonly plans$ = this.httpClient
    .get<LiveEnvelope<readonly LivePlan[]>>(`${this.adminUrl}/plans`)
    .pipe(
      map(({ data }) => data),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
  private readonly platforms$ = this.readAll<LiveDeliveryPlatform>('deliveryplatforms').pipe(
    shareReplay({ bufferSize: 1, refCount: false }),
  );

  getPlaces(query: PlaceQuery): Observable<PagedResult<Place>> {
    return this.plans$.pipe(
      switchMap((plans) =>
        this.httpClient
          .get<PagedResult<LivePlaceRow>>(this.storesUrl, {
            params: toPlaceQueryParams(query, plans),
          })
          .pipe(
            map((page) => ({
              items: page.items.map((row) => toPlace(row, plans)),
              totalCount: page.totalCount,
            })),
          ),
      ),
    );
  }

  getStatusCounts(): Observable<PlaceStatusCounts> {
    return this.httpClient
      .get<LiveEnvelope<PlaceStatusCounts>>(`${this.adminUrl}/places/statuscounts`)
      .pipe(map(({ data }) => data));
  }

  /** The place page names no platform on its links, so they are read from their own route. */
  getPlace(id: string): Observable<PlaceDetail> {
    return this.plans$.pipe(
      switchMap((plans) =>
        forkJoin({
          place: this.httpClient.get<LiveEnvelope<LivePlaceDetail>>(`${this.storesUrl}/${id}`),
          links: this.httpClient.get<LiveEnvelope<readonly LiveStoreDeliveryLink[]>>(
            `${this.storesUrl}/${id}/delivery-links`,
          ),
          platforms: this.platforms$,
        }).pipe(
          map(({ place, links, platforms }) =>
            toPlaceDetail(
              place.data,
              this.clock(),
              plans,
              toPlaceDeliveryLinks(platforms, links.data),
            ),
          ),
        ),
      ),
    );
  }

  setPlacesStatus(ids: readonly string[], status: ActivationStatus): Observable<void> {
    return this.httpClient
      .patch(`${this.storesUrl}/status`, { ids, status: toLivePlaceStatus(status) })
      .pipe(map(() => undefined));
  }

  deletePlaces(ids: readonly string[]): Observable<void> {
    return this.httpClient.delete(this.storesUrl, { body: { ids } }).pipe(map(() => undefined));
  }

  exportPlaces({ query, ids }: PlaceExportRequest): Observable<Blob> {
    return this.plans$.pipe(
      switchMap((plans) => {
        let params = toPlaceFilterParams(query, plans);
        for (const id of ids) {
          params = params.append('ids[]', id);
        }
        return this.httpClient.get(`${this.storesUrl}/export`, { params, responseType: 'blob' });
      }),
    );
  }

  getPlaceFormChoices(): Observable<PlaceFormChoices> {
    return forkJoin({ options: this.readFormOptions(), platforms: this.platforms$ }).pipe(
      map(({ options, platforms }) => toPlaceFormChoices(options, platforms)),
    );
  }

  savePlace(id: string | null, request: PlaceSaveRequest): Observable<string> {
    return forkJoin({ choices: this.getPlaceFormChoices(), plans: this.plans$ }).pipe(
      switchMap(({ choices, plans }) => this.writer.save(id, request, choices, plans)),
    );
  }

  getCategoryOptions(): Observable<readonly SelectOption[]> {
    return this.readFormOptions().pipe(
      map((options) =>
        options.mainCategories.map((category) => ({ value: category.id, label: category.name })),
      ),
    );
  }

  /** When the form options route fails, the same choices come from the lists the admins keep. */
  private readFormOptions(): Observable<LivePlaceFormOptions> {
    return this.httpClient
      .get<LiveEnvelope<LivePlaceFormOptions>>(`${this.storesUrl}/formoptions`)
      .pipe(
        map(({ data }) => data),
        catchError(() =>
          forkJoin({
            categories: this.readAll<LiveCategory>('categories'),
            regions: this.readAll<LiveRegion>('regions'),
            cities: this.readAll<LiveCity>('cities'),
          }).pipe(
            map(({ categories, regions, cities }) =>
              toLivePlaceFormOptions(categories, regions, cities),
            ),
          ),
        ),
      );
  }

  private readAll<T>(path: string): Observable<readonly T[]> {
    return readAllMetaPages((page) =>
      this.httpClient.get<LiveMetaPage<T>>(`${this.adminUrl}/${path}`, {
        params: { page, per_page: ALL_ROWS_PAGE_SIZE },
      }),
    );
  }
}
