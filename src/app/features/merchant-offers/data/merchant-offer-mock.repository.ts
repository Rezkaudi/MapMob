import { Injectable, inject } from '@angular/core';
import { Observable, from, map, shareReplay, switchMap } from 'rxjs';
import { mockRequest } from '../../../../mock/mock-delay';
import { CLOCK } from '../../../core/config/clock';
import { OfferDraftFields } from '../../../shared/models/offer-draft-fields';
import { OfferItem } from '../../../shared/models/offer-item';
import { MerchantOffer } from '../models/merchant-offer';
import { MerchantOfferCatalog } from '../models/merchant-offer-catalog';
import type { MerchantOfferMockDatabase } from './merchant-offer-mock-database';
import { MerchantOfferRepository } from './merchant-offer.repository';

@Injectable()
export class MerchantOfferMockRepository implements MerchantOfferRepository {
  private readonly clock = inject(CLOCK);
  // Loaded on first use, so the seed and its copy stay out of the initial bundle.
  private readonly database$ = from(import('./merchant-offer-mock-database')).pipe(
    map((module) => new module.MerchantOfferMockDatabase(this.clock)),
    shareReplay(1),
  );

  getCatalog(): Observable<MerchantOfferCatalog> {
    return this.run((database) => database.readCatalog());
  }

  getOffer(id: string): Observable<MerchantOffer> {
    return this.run((database) => database.readOffer(id));
  }

  getItems(): Observable<readonly OfferItem[]> {
    return this.run((database) => database.readItems());
  }

  createOffer(draft: OfferDraftFields): Observable<MerchantOffer> {
    return this.run((database) => database.create(draft));
  }

  updateOffer(id: string, draft: OfferDraftFields): Observable<MerchantOffer> {
    return this.run((database) => database.update(id, draft));
  }

  pauseOffer(id: string): Observable<MerchantOffer> {
    return this.run((database) => database.setPaused(id, true));
  }

  resumeOffer(id: string): Observable<MerchantOffer> {
    return this.run((database) => database.setPaused(id, false));
  }

  deleteOffer(id: string): Observable<void> {
    return this.run((database) => database.remove(id));
  }

  private run<T>(work: (database: MerchantOfferMockDatabase) => T): Observable<T> {
    return this.database$.pipe(switchMap((database) => mockRequest(() => work(database))));
  }
}
