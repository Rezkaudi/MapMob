import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { mockRequest } from '../../../../mock/mock-delay';
import { Area } from '../models/area';
import { AreaQuery } from '../models/area-query';
import { RegionDraft } from '../models/region-draft';
import { RegionStatus } from '../models/region-status';
import { AreaRepository } from './area.repository';
import { RegionMockDatabase } from './region-mock-database';
import { queryRegionEntries } from './region-mock-query';

@Injectable()
export class AreaMockRepository implements AreaRepository {
  private readonly database = inject(RegionMockDatabase);

  getAreas(query: AreaQuery): Observable<PagedResult<Area>> {
    return mockRequest(() =>
      queryRegionEntries(this.database.listAreas(query.governorateId), query),
    );
  }

  createArea(governorateId: string, draft: RegionDraft): Observable<Area> {
    return mockRequest(() => this.database.addArea(governorateId, draft));
  }

  updateArea(id: string, draft: RegionDraft): Observable<Area> {
    return mockRequest(() => this.database.updateArea(id, draft));
  }

  setAreaStatus(id: string, status: RegionStatus): Observable<Area> {
    return mockRequest(() => this.database.updateArea(id, { status }));
  }

  deleteArea(id: string): Observable<void> {
    return mockRequest(() => this.database.removeArea(id));
  }
}
