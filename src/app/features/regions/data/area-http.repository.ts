import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { PagedResult } from '../../../core/models/paged-result';
import { Area } from '../models/area';
import { AreaQuery } from '../models/area-query';
import { RegionDraft } from '../models/region-draft';
import { RegionStatus } from '../models/region-status';
import { AreaRepository } from './area.repository';
import { toRegionQueryParams } from './region-query-params';

@Injectable()
export class AreaHttpRepository implements AreaRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getAreas(query: AreaQuery): Observable<PagedResult<Area>> {
    return this.httpClient.get<PagedResult<Area>>(this.governorateAreasUrl(query.governorateId), {
      params: toRegionQueryParams(query),
    });
  }

  createArea(governorateId: string, draft: RegionDraft): Observable<Area> {
    return this.httpClient.post<Area>(this.governorateAreasUrl(governorateId), draft);
  }

  updateArea(id: string, draft: RegionDraft): Observable<Area> {
    return this.httpClient.put<Area>(`${this.apiBaseUrl}/areas/${id}`, draft);
  }

  setAreaStatus(id: string, status: RegionStatus): Observable<Area> {
    return this.httpClient.patch<Area>(`${this.apiBaseUrl}/areas/${id}/status`, { status });
  }

  deleteArea(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiBaseUrl}/areas/${id}`);
  }

  private governorateAreasUrl(governorateId: string): string {
    return `${this.apiBaseUrl}/governorates/${governorateId}/areas`;
  }
}
