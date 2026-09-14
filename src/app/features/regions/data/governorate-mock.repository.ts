import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { mockRequest } from '../../../../mock/mock-delay';
import { Governorate } from '../models/governorate';
import { GovernorateQuery } from '../models/governorate-query';
import { RegionDraft } from '../models/region-draft';
import { RegionStatus } from '../models/region-status';
import { GovernorateRepository } from './governorate.repository';
import { RegionMockDatabase } from './region-mock-database';
import { queryRegionEntries } from './region-mock-query';

@Injectable()
export class GovernorateMockRepository implements GovernorateRepository {
  private readonly database = inject(RegionMockDatabase);

  getGovernorates(query: GovernorateQuery): Observable<PagedResult<Governorate>> {
    return mockRequest(() => queryRegionEntries(this.database.listGovernorates(), query));
  }

  getGovernorate(id: string): Observable<Governorate> {
    return mockRequest(() => {
      const governorate = this.database.findGovernorate(id);
      if (!governorate) {
        throw new Error('لم يتم العثور على المحافظة');
      }
      return governorate;
    });
  }

  createGovernorate(draft: RegionDraft): Observable<Governorate> {
    return mockRequest(() => this.database.addGovernorate(draft));
  }

  updateGovernorate(id: string, draft: RegionDraft): Observable<Governorate> {
    return mockRequest(() => this.database.updateGovernorate(id, draft));
  }

  setGovernorateStatus(id: string, status: RegionStatus): Observable<Governorate> {
    return mockRequest(() => this.database.updateGovernorate(id, { status }));
  }

  deleteGovernorate(id: string): Observable<void> {
    return mockRequest(() => this.database.removeGovernorate(id));
  }
}
