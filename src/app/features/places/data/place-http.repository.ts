import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { PagedResult } from '../../../core/models/paged-result';
import { ActivationStatus } from '../../../shared/models/activation-status';
import { Place } from '../models/place';
import { PlaceDetail } from '../models/place-detail';
import { PlaceExportRequest } from '../models/place-export-request';
import { PlaceQuery } from '../models/place-query';
import { PlaceStatusCounts } from '../models/place-status-counts';
import { toPlaceQueryParams } from './place-query-params';
import { PlaceRepository } from './place.repository';

@Injectable()
export class PlaceHttpRepository implements PlaceRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly placesUrl = `${inject(API_BASE_URL)}/places`;

  getPlaces(query: PlaceQuery): Observable<PagedResult<Place>> {
    return this.httpClient.get<PagedResult<Place>>(this.placesUrl, {
      params: toPlaceQueryParams(query),
    });
  }

  getStatusCounts(): Observable<PlaceStatusCounts> {
    return this.httpClient.get<PlaceStatusCounts>(`${this.placesUrl}/status-counts`);
  }

  getPlace(id: string): Observable<PlaceDetail> {
    return this.httpClient.get<PlaceDetail>(`${this.placesUrl}/${id}`);
  }

  setPlacesStatus(ids: readonly string[], status: ActivationStatus): Observable<void> {
    return this.httpClient.patch<void>(`${this.placesUrl}/status`, { ids, status });
  }

  /** A body carries the ids, which a DELETE cannot do, so the bulk delete is a POST. */
  deletePlaces(ids: readonly string[]): Observable<void> {
    return this.httpClient.post<void>(`${this.placesUrl}/delete`, { ids });
  }

  exportPlaces({ query, ids }: PlaceExportRequest): Observable<Blob> {
    let params = toPlaceQueryParams(query);
    for (const id of ids) {
      params = params.append('ids', id);
    }
    return this.httpClient.get(`${this.placesUrl}/export`, { params, responseType: 'blob' });
  }
}
