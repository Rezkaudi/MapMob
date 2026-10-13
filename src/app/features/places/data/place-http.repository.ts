import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CLOCK } from '../../../core/config/clock';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { PagedResult } from '../../../core/models/paged-result';
import { ActivationStatus } from '../../../shared/models/activation-status';
import { SelectOption } from '../../../shared/ui/select-field/select-option';
import { Place } from '../models/place';
import { PlaceDetail } from '../models/place-detail';
import { PlaceExportRequest } from '../models/place-export-request';
import { PlaceQuery } from '../models/place-query';
import { PlaceStatusCounts } from '../models/place-status-counts';
import { LivePlaceDetail } from './live-place-detail';
import { LivePlaceFormOptions } from './live-place-form-options';
import { toPlaceDetail } from './live-place-detail-mapping';
import { toLivePlaceStatus, toPlace } from './live-place-mapping';
import { LivePlaceRow } from './live-place-row';
import { toPlaceFilterParams, toPlaceQueryParams } from './place-query-params';
import { PlaceRepository } from './place.repository';

@Injectable()
export class PlaceHttpRepository implements PlaceRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly clock = inject(CLOCK);
  private readonly adminUrl = `${inject(API_BASE_URL)}/admin`;
  private readonly storesUrl = `${this.adminUrl}/stores`;

  getPlaces(query: PlaceQuery): Observable<PagedResult<Place>> {
    return this.httpClient
      .get<PagedResult<LivePlaceRow>>(this.storesUrl, { params: toPlaceQueryParams(query) })
      .pipe(map((page) => ({ items: page.items.map(toPlace), totalCount: page.totalCount })));
  }

  getStatusCounts(): Observable<PlaceStatusCounts> {
    return this.httpClient
      .get<LiveEnvelope<PlaceStatusCounts>>(`${this.adminUrl}/places/statuscounts`)
      .pipe(map(({ data }) => data));
  }

  getPlace(id: string): Observable<PlaceDetail> {
    return this.httpClient
      .get<LiveEnvelope<LivePlaceDetail>>(`${this.storesUrl}/${id}`)
      .pipe(map(({ data }) => toPlaceDetail(data, this.clock())));
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
    let params = toPlaceFilterParams(query);
    for (const id of ids) {
      params = params.append('ids[]', id);
    }
    return this.httpClient.get(`${this.storesUrl}/export`, { params, responseType: 'blob' });
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
