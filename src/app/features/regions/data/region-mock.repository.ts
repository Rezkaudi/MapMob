import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { mockResponse } from '../../../../mock/mock-delay';
import { paginate } from '../../../../mock/paginate';
import { Region } from '../models/region';
import { RegionQuery } from '../models/region-query';
import { RegionRepository } from './region.repository';

const REGION_NAMES = [
  'طرطوس',
  'حمص',
  'اللاذقية',
  'دمشق',
  'حلب',
  'حماة',
  'درعا',
  'السويداء',
  'إدلب',
  'الحسكة',
];

const ALL_REGIONS: readonly Region[] = REGION_NAMES.map((name, index) => ({
  id: `region-${index + 1}`,
  name,
  districtCount: 5,
  placeCount: 1200,
  status: name === 'اللاذقية' ? 'suspended' : 'active',
  updatedAt: '2024-01-12T00:00:00.000Z',
}));

@Injectable()
export class RegionMockRepository implements RegionRepository {
  getRegions(query: RegionQuery): Observable<PagedResult<Region>> {
    const filtered = ALL_REGIONS.filter(
      (region) => !query.search || region.name.includes(query.search),
    );
    return mockResponse(paginate(filtered, query.pageIndex, query.pageSize));
  }
}
