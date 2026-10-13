import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { LivePage, toPagedResult } from '../../../core/http/live-page';
import { toLivePageParams } from '../../../core/http/live-page-params';
import { PagedResult } from '../../../core/models/paged-result';
import { Area } from '../models/area';
import { AreaQuery } from '../models/area-query';
import { RegionDraft } from '../models/region-draft';
import { RegionStatus } from '../models/region-status';
import { AreaRepository } from './area.repository';
import { LiveCity } from './live-city';
import {
  toArea,
  toLiveNewRegionBody,
  toLiveRegionBody,
  toLiveStatusBody,
} from './live-region-mapping';

@Injectable()
export class AreaHttpRepository implements AreaRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly citiesUrl = `${inject(API_BASE_URL)}/admin/cities`;

  getAreas(query: AreaQuery): Observable<PagedResult<Area>> {
    const params = toLivePageParams(query).set('region_id', query.governorateId);
    return this.httpClient
      .get<LivePage<LiveCity>>(this.citiesUrl, { params })
      .pipe(map((page) => toPagedResult(page, toArea)));
  }

  createArea(governorateId: string, draft: RegionDraft): Observable<Area> {
    const body = { region_id: Number(governorateId), ...toLiveNewRegionBody(draft) };
    return this.httpClient
      .post<LiveEnvelope<LiveCity>>(this.citiesUrl, body)
      .pipe(map(({ data }) => toArea(data)));
  }

  updateArea(id: string, draft: RegionDraft): Observable<Area> {
    return this.save(id, toLiveRegionBody(draft));
  }

  setAreaStatus(id: string, status: RegionStatus): Observable<Area> {
    return this.save(id, toLiveStatusBody(status));
  }

  deleteArea(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.citiesUrl}/${id}`);
  }

  private save(id: string, body: object): Observable<Area> {
    return this.httpClient
      .put<LiveEnvelope<LiveCity>>(`${this.citiesUrl}/${id}`, body)
      .pipe(map(({ data }) => toArea(data)));
  }
}
