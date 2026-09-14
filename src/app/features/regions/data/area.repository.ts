import { Observable } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { Area } from '../models/area';
import { AreaQuery } from '../models/area-query';
import { RegionDraft } from '../models/region-draft';
import { RegionStatus } from '../models/region-status';

export abstract class AreaRepository {
  abstract getAreas(query: AreaQuery): Observable<PagedResult<Area>>;
  abstract createArea(governorateId: string, draft: RegionDraft): Observable<Area>;
  abstract updateArea(id: string, draft: RegionDraft): Observable<Area>;
  abstract setAreaStatus(id: string, status: RegionStatus): Observable<Area>;
  abstract deleteArea(id: string): Observable<void>;
}
