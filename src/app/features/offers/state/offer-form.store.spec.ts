import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { OfferRepository } from '../data/offer.repository';
import { OfferDraft } from '../models/offer-draft';
import { buildOffer, buildOfferDetail, buildOfferDraft } from '../testing/offer-fixture';
import { OfferFormStore } from './offer-form.store';

const DETAIL = buildOfferDetail();
const OPTIONS = { places: [DETAIL.place], categoryNames: ['ألبسة'] };
const ITEMS = [{ id: 'place-7-item-1', name: 'شامبو 1', price: 200 }];

function createStore(overrides: Partial<OfferRepository> = {}) {
  const saved: string[] = [];
  const repository: Partial<OfferRepository> = {
    getFormOptions: () => of(OPTIONS),
    getOfferDetail: () => of(DETAIL),
    getPlaceItems: () => of(ITEMS),
    createOffer: (draft: OfferDraft) => {
      saved.push(`create ${draft.title}`);
      return of(buildOffer());
    },
    updateOffer: (id: string) => {
      saved.push(`update ${id}`);
      return of(buildOffer());
    },
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [OfferFormStore, { provide: OfferRepository, useValue: repository }],
  });
  return { store: TestBed.inject(OfferFormStore), saved };
}

describe('OfferFormStore', () => {
  it('loads the options for a new offer', () => {
    const { store } = createStore();

    store.load(null);

    expect(store.options()).toEqual(OPTIONS);
    expect(store.editedDetail()).toBeNull();
    expect(store.isReady()).toBe(true);
  });

  it('loads the offer being edited with its store items', () => {
    const { store } = createStore();

    store.load('offer-2');

    expect(store.editedDetail()).toEqual(DETAIL);
    expect(store.items()).toEqual(ITEMS);
  });

  it('keeps the load error and tries again on retry', () => {
    let calls = 0;
    const { store } = createStore({
      getFormOptions: () => {
        calls += 1;
        return calls === 1 ? throwError(() => new Error('تعذر تحميل البيانات')) : of(OPTIONS);
      },
    });

    store.load(null);
    expect(store.error()).toBe('تعذر تحميل البيانات');

    store.retry();
    expect(store.isReady()).toBe(true);
  });

  it('loads the items of a newly picked store, and clears them with no store', () => {
    const { store } = createStore();

    store.loadItems('place-7');
    expect(store.items()).toEqual(ITEMS);
    expect(store.isItemsLoading()).toBe(false);

    store.loadItems('');
    expect(store.items()).toEqual([]);
  });

  it('creates a new offer and updates an edited one', async () => {
    const { store, saved } = createStore();

    expect(await store.save(null, buildOfferDraft())).toBe(true);
    expect(await store.save('offer-2', buildOfferDraft())).toBe(true);

    expect(saved).toEqual(['create خصم 30% على جميع المنتجات', 'update offer-2']);
  });

  it('keeps the save error', async () => {
    const { store } = createStore({
      createOffer: () => throwError(() => new Error('تعذر حفظ العرض')) as Observable<never>,
    });

    expect(await store.save(null, buildOfferDraft())).toBe(false);
    expect(store.saveError()).toBe('تعذر حفظ العرض');
  });
});
