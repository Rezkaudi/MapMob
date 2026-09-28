import { Observable, of, throwError } from 'rxjs';
import { OfferDraftFields } from '../../../shared/models/offer-draft-fields';
import { OfferItem } from '../../../shared/models/offer-item';
import { MerchantOfferRepository } from '../data/merchant-offer.repository';
import { MerchantOffer } from '../models/merchant-offer';
import { MerchantOfferCatalog } from '../models/merchant-offer-catalog';
import { buildMerchantOffer, buildMerchantOfferCatalog } from './merchant-offer-fixture';

/** Answers at once, remembers every write, and fails every call while `failure` is set. */
export class FakeMerchantOfferRepository extends MerchantOfferRepository {
  catalog: MerchantOfferCatalog = buildMerchantOfferCatalog();
  items: readonly OfferItem[] = [{ id: 'product-1', name: 'شامبو 1', price: 200, currency: 'SYP' }];
  failure: Error | null = null;
  created: OfferDraftFields[] = [];
  updated: [string, OfferDraftFields][] = [];
  paused: string[] = [];
  resumed: string[] = [];
  deleted: string[] = [];

  getCatalog(): Observable<MerchantOfferCatalog> {
    return this.answer(this.catalog);
  }
  getOffer(id: string): Observable<MerchantOffer> {
    const offer = this.catalog.items.find((candidate) => candidate.id === id);
    return offer ? this.answer(offer) : throwError(() => new Error('العرض غير موجود.'));
  }
  getItems(): Observable<readonly OfferItem[]> {
    return this.answer(this.items);
  }
  createOffer(draft: OfferDraftFields): Observable<MerchantOffer> {
    this.created.push(draft);
    return this.answer(buildMerchantOffer({ id: 'offer-new', title: draft.title }));
  }
  updateOffer(id: string, draft: OfferDraftFields): Observable<MerchantOffer> {
    this.updated.push([id, draft]);
    return this.answer(buildMerchantOffer({ id, title: draft.title }));
  }
  pauseOffer(id: string): Observable<MerchantOffer> {
    this.paused.push(id);
    return this.answer(this.withStatus(id, 'paused'));
  }
  resumeOffer(id: string): Observable<MerchantOffer> {
    this.resumed.push(id);
    return this.answer(this.withStatus(id, 'active'));
  }
  deleteOffer(id: string): Observable<void> {
    this.deleted.push(id);
    return this.answer(undefined);
  }

  private withStatus(id: string, status: MerchantOffer['status']): MerchantOffer {
    const offer = this.catalog.items.find((candidate) => candidate.id === id);
    return { ...(offer ?? buildMerchantOffer({ id })), status };
  }
  private answer<T>(value: T): Observable<T> {
    return this.failure ? throwError(() => this.failure) : of(value);
  }
}
