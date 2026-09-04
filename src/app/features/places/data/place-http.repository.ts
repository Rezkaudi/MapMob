import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { PagedResult } from '../../../core/models/paged-result';
import { Place } from '../models/place';
import { PlaceQuery } from '../models/place-query';
import { PlaceRepository } from './place.repository';

@Injectable()
export class PlaceHttpRepository implements PlaceRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getPlaces(query: PlaceQuery): Observable<PagedResult<Place>> {
    let params = new HttpParams().set('pageIndex', query.pageIndex).set('pageSize', query.pageSize);
    if (query.search) {
      params = params.set('search', query.search);
    }
    if (query.status) {
      params = params.set('status', query.status);
    }
    return this.httpClient.get<PagedResult<Place>>(`${this.apiBaseUrl}/places`, { params });
  }
}
