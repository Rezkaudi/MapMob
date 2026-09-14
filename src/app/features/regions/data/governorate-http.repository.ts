import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { PagedResult } from '../../../core/models/paged-result';
import { Governorate } from '../models/governorate';
import { GovernorateQuery } from '../models/governorate-query';
import { RegionDraft } from '../models/region-draft';
import { RegionStatus } from '../models/region-status';
import { GovernorateRepository } from './governorate.repository';
import { toRegionQueryParams } from './region-query-params';

@Injectable()
export class GovernorateHttpRepository implements GovernorateRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly governoratesUrl = `${inject(API_BASE_URL)}/governorates`;

  getGovernorates(query: GovernorateQuery): Observable<PagedResult<Governorate>> {
    return this.httpClient.get<PagedResult<Governorate>>(this.governoratesUrl, {
      params: toRegionQueryParams(query),
    });
  }

  getGovernorate(id: string): Observable<Governorate> {
    return this.httpClient.get<Governorate>(`${this.governoratesUrl}/${id}`);
  }

  createGovernorate(draft: RegionDraft): Observable<Governorate> {
    return this.httpClient.post<Governorate>(this.governoratesUrl, draft);
  }

  updateGovernorate(id: string, draft: RegionDraft): Observable<Governorate> {
    return this.httpClient.put<Governorate>(`${this.governoratesUrl}/${id}`, draft);
  }

  setGovernorateStatus(id: string, status: RegionStatus): Observable<Governorate> {
    return this.httpClient.patch<Governorate>(`${this.governoratesUrl}/${id}/status`, { status });
  }

  deleteGovernorate(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.governoratesUrl}/${id}`);
  }
}
