import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { PagedResult } from '../../../core/models/paged-result';
import { Region } from '../models/region';
import { RegionQuery } from '../models/region-query';
import { RegionRepository } from './region.repository';

@Injectable()
export class RegionHttpRepository implements RegionRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getRegions(query: RegionQuery): Observable<PagedResult<Region>> {
    let params = new HttpParams().set('pageIndex', query.pageIndex).set('pageSize', query.pageSize);
    if (query.search) {
      params = params.set('search', query.search);
    }
    return this.httpClient.get<PagedResult<Region>>(`${this.apiBaseUrl}/regions`, { params });
  }
}
