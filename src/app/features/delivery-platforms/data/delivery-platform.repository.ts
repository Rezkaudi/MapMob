import { Observable } from 'rxjs';
import { ListQuery } from '../../../shared/models/list-query';
import { DeliveryPlatformDraft } from '../models/delivery-platform-draft';
import { DeliveryPlatformEntry } from '../models/delivery-platform-entry';
import { DeliveryPlatformPage } from '../models/delivery-platform-page';
import { DeliveryPlatformStatus } from '../models/delivery-platform-status';
import { DeliveryPlatformSummary } from '../models/delivery-platform-summary';
import { LinkedStore } from '../models/linked-store';

export abstract class DeliveryPlatformRepository {
  abstract getPlatforms(query: ListQuery): Observable<DeliveryPlatformPage>;
  abstract getSummary(): Observable<DeliveryPlatformSummary>;
  abstract createPlatform(draft: DeliveryPlatformDraft): Observable<DeliveryPlatformEntry>;
  abstract updatePlatform(
    id: string,
    draft: DeliveryPlatformDraft,
  ): Observable<DeliveryPlatformEntry>;
  abstract setPlatformStatus(
    id: string,
    status: DeliveryPlatformStatus,
  ): Observable<DeliveryPlatformEntry>;
  abstract deletePlatform(id: string): Observable<void>;
  abstract getLinkedStores(id: string): Observable<readonly LinkedStore[]>;
}
