import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, shareReplay, switchMap } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CLOCK } from '../../../core/config/clock';
import { LiveEnvelope } from '../../../core/http/live-envelope';
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
import { LivePlaceDetail } from './live-place-detail';
import { toPlaceFormChoices } from './live-place-choices';
import { LivePlaceFormOptions } from './live-place-form-options';
import { toPlaceDetail } from './live-place-detail-mapping';
import { toLivePlaceStatus, toPlace } from './live-place-mapping';
import { LivePlaceRow } from './live-place-row';
import { toPlaceFilterParams, toPlaceQueryParams } from './place-query-params';
import { PlaceRepository } from './place.repository';
import { PlaceWriter } from './place-writer';

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

  getPlace(id: string): Observable<PlaceDetail> {
    return this.plans$.pipe(
      switchMap((plans) =>
        this.httpClient
          .get<LiveEnvelope<LivePlaceDetail>>(`${this.storesUrl}/${id}`)
          .pipe(map(({ data }) => toPlaceDetail(data, this.clock(), plans))),
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
    return this.httpClient
      .get<LiveEnvelope<LivePlaceFormOptions>>(`${this.storesUrl}/formoptions`)
      .pipe(map(({ data }) => toPlaceFormChoices(data)));
  }

  savePlace(id: string | null, request: PlaceSaveRequest): Observable<string> {
    return forkJoin({ choices: this.getPlaceFormChoices(), plans: this.plans$ }).pipe(
      switchMap(({ choices, plans }) => this.writer.save(id, request, choices, plans)),
    );
  }

  getCategoryOptions(): Observable<readonly SelectOption[]> {
    return this.httpClient
      .get<LiveEnvelope<LivePlaceFormOptions>>(`${this.storesUrl}/formoptions`)
      .pipe(
        map(({ data }) =>
          data.mainCategories.map((category) => ({ value: category.id, label: category.name })),
        ),
      );
  }
}
