import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { OfferRepository } from '../data/offer.repository';
import { buildOfferDetail } from '../testing/offer-fixture';
import { OfferDetailStore } from './offer-detail.store';

const DETAIL = buildOfferDetail();

function createStore(getOfferDetail: OfferRepository['getOfferDetail']) {
  TestBed.configureTestingModule({
    providers: [OfferDetailStore, { provide: OfferRepository, useValue: { getOfferDetail } }],
  });
  return TestBed.inject(OfferDetailStore);
}

describe('OfferDetailStore', () => {
  it('opens an offer, loads it and closes again', () => {
    const store = createStore(() => of(DETAIL));

    store.open('offer-2');

    expect(store.isOpen()).toBe(true);
    expect(store.detail()).toEqual(DETAIL);
    expect(store.view()?.placeInitial).toBe('ج');
    expect(store.isLoading()).toBe(false);

    store.close();
    expect(store.isOpen()).toBe(false);
    expect(store.detail()).toBeNull();
    expect(store.view()).toBeNull();
  });

  it('keeps the error and loads the same offer again on retry', () => {
    let calls = 0;
    const store = createStore(() => {
      calls += 1;
      return calls === 1 ? throwError(() => new Error('تعذر تحميل العرض')) : of(DETAIL);
    });

    store.open('offer-2');
    expect(store.error()).toBe('تعذر تحميل العرض');

    store.reload();
    expect(store.detail()).toEqual(DETAIL);
  });
});
