import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { LivePage, toPagedResult } from '../../../core/http/live-page';
import { toLivePageParams } from '../../../core/http/live-page-params';
import { PagedResult } from '../../../core/models/paged-result';
import { Governorate } from '../models/governorate';
import { GovernorateQuery } from '../models/governorate-query';
import { RegionDraft } from '../models/region-draft';
import { RegionStatus } from '../models/region-status';
import { GovernorateRepository } from './governorate.repository';
import { LiveRegion } from './live-region';
import {
  toGovernorate,
  toLiveNewRegionBody,
  toLiveRegionBody,
  toLiveStatusBody,
} from './live-region-mapping';

@Injectable()
export class GovernorateHttpRepository implements GovernorateRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly regionsUrl = `${inject(API_BASE_URL)}/admin/regions`;

  getGovernorates(query: GovernorateQuery): Observable<PagedResult<Governorate>> {
    return this.httpClient
      .get<LivePage<LiveRegion>>(this.regionsUrl, { params: toLivePageParams(query) })
      .pipe(map((page) => toPagedResult(page, toGovernorate)));
  }

  getGovernorate(id: string): Observable<Governorate> {
    return this.httpClient
      .get<LiveEnvelope<LiveRegion>>(`${this.regionsUrl}/${id}`)
      .pipe(map(({ data }) => toGovernorate(data)));
  }

  createGovernorate(draft: RegionDraft): Observable<Governorate> {
    return this.httpClient
      .post<LiveEnvelope<LiveRegion>>(this.regionsUrl, toLiveNewRegionBody(draft))
      .pipe(map(({ data }) => toGovernorate(data)));
  }

  updateGovernorate(id: string, draft: RegionDraft): Observable<Governorate> {
    return this.save(id, toLiveRegionBody(draft));
  }

  setGovernorateStatus(id: string, status: RegionStatus): Observable<Governorate> {
    return this.save(id, toLiveStatusBody(status));
  }

  deleteGovernorate(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.regionsUrl}/${id}`);
  }

  private save(id: string, body: object): Observable<Governorate> {
    return this.httpClient
      .put<LiveEnvelope<LiveRegion>>(`${this.regionsUrl}/${id}`, body)
      .pipe(map(({ data }) => toGovernorate(data)));
  }
}
