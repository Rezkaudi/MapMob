import { Observable } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { Governorate } from '../models/governorate';
import { GovernorateQuery } from '../models/governorate-query';
import { RegionDraft } from '../models/region-draft';
import { RegionStatus } from '../models/region-status';

export abstract class GovernorateRepository {
  abstract getGovernorates(query: GovernorateQuery): Observable<PagedResult<Governorate>>;
  abstract getGovernorate(id: string): Observable<Governorate>;
  abstract createGovernorate(draft: RegionDraft): Observable<Governorate>;
  abstract updateGovernorate(id: string, draft: RegionDraft): Observable<Governorate>;
  abstract setGovernorateStatus(id: string, status: RegionStatus): Observable<Governorate>;
  abstract deleteGovernorate(id: string): Observable<void>;
}
