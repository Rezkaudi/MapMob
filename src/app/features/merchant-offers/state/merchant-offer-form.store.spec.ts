import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { MerchantOfferRepository } from '../data/merchant-offer.repository';
import { buildOfferDraftFields } from '../testing/merchant-offer-fixture';
import { FakeMerchantOfferRepository } from '../testing/fake-merchant-offer-repository';
import { MerchantOfferFormStore } from './merchant-offer-form.store';

function setUp(
  editingId: string | null,
  configure: (repository: FakeMerchantOfferRepository) => void = () => undefined,
) {
  const repository = new FakeMerchantOfferRepository();
  configure(repository);
  TestBed.configureTestingModule({
    providers: [MerchantOfferFormStore, { provide: MerchantOfferRepository, useValue: repository }],
  });
  const store = TestBed.inject(MerchantOfferFormStore);
  store.load(signal(editingId));
  TestBed.tick();
  return { store, repository };
}

describe('MerchantOfferFormStore', () => {
  it("loads the place's items for a new offer", () => {
    const { store } = setUp(null);

    expect(store.items().map((item) => item.name)).toEqual(['شامبو 1']);
    expect(store.editedOffer()).toBeNull();
    expect(store.isReady()).toBe(true);
  });

  it('loads the offer being edited too', () => {
    const { store } = setUp('offer-1');

    expect(store.editedOffer()?.id).toBe('offer-1');
    expect(store.isReady()).toBe(true);
  });

  it('keeps the load error and tries again', () => {
    const { store, repository } = setUp('offer-404');
    expect(store.error()).toBe('العرض غير موجود.');

    repository.catalog = {
      ...repository.catalog,
      items: [{ ...repository.catalog.items[0], id: 'offer-404' }],
    };
    store.retry();
    TestBed.tick();

    expect(store.editedOffer()?.id).toBe('offer-404');
  });

  it('adds a new offer, or saves the one being edited', async () => {
    const draft = buildOfferDraftFields();
    const added = setUp(null);
    expect(await added.store.save(draft)).toBe(true);
    expect(added.repository.created).toEqual([draft]);

    TestBed.resetTestingModule();
    const edited = setUp('offer-1');
    expect(await edited.store.save(draft)).toBe(true);
    expect(edited.repository.updated).toEqual([['offer-1', draft]]);
  });

  it('reports a failed save', async () => {
    const { store, repository } = setUp(null);
    repository.failure = new Error('وصلت للحد المتاح من العروض النشطة في باقتك الحالية.');

    expect(await store.save(buildOfferDraftFields())).toBe(false);
    expect(store.saveError()).toBe('وصلت للحد المتاح من العروض النشطة في باقتك الحالية.');
  });
});
