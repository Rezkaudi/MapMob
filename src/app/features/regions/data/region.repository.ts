import { Observable } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { Region } from '../models/region';
import { RegionQuery } from '../models/region-query';

export abstract class RegionRepository {
  abstract getRegions(query: RegionQuery): Observable<PagedResult<Region>>;
}
