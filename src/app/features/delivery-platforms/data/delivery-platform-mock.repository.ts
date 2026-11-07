import { Injectable, inject } from '@angular/core';
import { Observable, from, shareReplay, switchMap } from 'rxjs';
import { mockRequest } from '../../../../mock/mock-delay';
import { CLOCK } from '../../../core/config/clock';
import { ListQuery } from '../../../shared/models/list-query';
import { DeliveryPlatformDraft } from '../models/delivery-platform-draft';
import { DeliveryPlatformEntry } from '../models/delivery-platform-entry';
import { DeliveryPlatformPage } from '../models/delivery-platform-page';
import { DeliveryPlatformStatus } from '../models/delivery-platform-status';
import { DeliveryPlatformSummary } from '../models/delivery-platform-summary';
import { LinkedStore } from '../models/linked-store';
import type { DeliveryPlatformMockDatabase } from './delivery-platform-mock-database';
import { DeliveryPlatformRepository } from './delivery-platform.repository';

@Injectable()
export class DeliveryPlatformMockRepository implements DeliveryPlatformRepository {
  private readonly clock = inject(CLOCK);
  // Loaded on first use, so the seed stays out of the initial bundle.
  private readonly database$ = from(this.openDatabase()).pipe(shareReplay(1));

  getPlatforms(query: ListQuery): Observable<DeliveryPlatformPage> {
    return this.run((database) => database.page(query));
  }

  getSummary(): Observable<DeliveryPlatformSummary> {
    return this.run((database) => database.summary());
  }

  createPlatform(draft: DeliveryPlatformDraft): Observable<DeliveryPlatformEntry> {
    return this.run((database) => database.add(draft));
  }

  updatePlatform(id: string, draft: DeliveryPlatformDraft): Observable<DeliveryPlatformEntry> {
    return this.run((database) => database.update(id, draft));
  }

  setPlatformStatus(id: string, status: DeliveryPlatformStatus): Observable<DeliveryPlatformEntry> {
    return this.run((database) => database.setStatus(id, status));
  }

  deletePlatform(id: string): Observable<void> {
    return this.run((database) => database.remove(id));
  }

  getLinkedStores(id: string): Observable<readonly LinkedStore[]> {
    return this.run((database) => database.linkedStores(id));
  }

  private async openDatabase(): Promise<DeliveryPlatformMockDatabase> {
    const [{ DeliveryPlatformMockDatabase }, { DELIVERY_PLATFORM_MOCK_SEED }] = await Promise.all([
      import('./delivery-platform-mock-database'),
      import('./delivery-platform-mock-seed'),
    ]);
    return new DeliveryPlatformMockDatabase(DELIVERY_PLATFORM_MOCK_SEED, this.clock);
  }

  private run<T>(work: (database: DeliveryPlatformMockDatabase) => T): Observable<T> {
    return this.database$.pipe(switchMap((database) => mockRequest(() => work(database))));
  }
}
