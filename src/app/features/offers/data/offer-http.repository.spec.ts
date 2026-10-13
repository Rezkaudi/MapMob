import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CLOCK } from '../../../core/config/clock';
import { buildOfferDraft } from '../testing/offer-fixture';
import { LiveOffer } from './live-offer';
import { toOffer, toOfferDetail } from './live-offer-mapping';
import { OfferHttpRepository } from './offer-http.repository';

const BASE_URL = 'https://api.test';
const OFFERS_URL = `${BASE_URL}/admin/offers`;
const STORES_URL = `${BASE_URL}/admin/stores`;
const TODAY = '2026-10-13';
const LIVE_OFFER: LiveOffer = {
  id: 2,
  store_id: 4,
  store_name: 'متجر السعادة',
  product_id: null,
  scope: { type: 'all_products', product_id: null, product_name: null },
  title: 'عرض الشهر',
  description: null,
  image: null,
  discount_percentage: '10.00',
  starts_at: '2026-09-22T00:00:00.000000Z',
  ends_at: '2026-12-22T00:00:00.000000Z',
  status: 'active',
};
const OFFER = toOffer(LIVE_OFFER, TODAY);

describe('OfferHttpRepository', () => {
  let repository: OfferHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OfferHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
        { provide: CLOCK, useValue: () => new Date(2026, 9, 13, 12) },
      ],
    });
    repository = TestBed.inject(OfferHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('asks for a page of offers and turns the rows into offers', async () => {
    const response = firstValueFrom(
      repository.getOffers({ pageIndex: 1, pageSize: 4, status: 'paused' }),
    );

    const request = http.expectOne((candidate) => candidate.url === OFFERS_URL);
    expect(request.request.params.get('status')).toBe('inactive');
    expect(request.request.params.get('page')).toBe('2');
    request.flush({ data: [LIVE_OFFER], meta: { total: 9 } });

    expect(await response).toEqual({ items: [OFFER], totalCount: 9 });
  });

  it('reads the summary and one offer in detail', async () => {
    const summaryResponse = firstValueFrom(repository.getSummary());
    const detailResponse = firstValueFrom(repository.getOfferDetail('2'));

    http
      .expectOne(`${OFFERS_URL}/summary`)
      .flush({ data: { total: 34, active: 16, scheduled: 14, expired_or_stopped: 4 } });
    http.expectOne(`${OFFERS_URL}/2`).flush({ data: LIVE_OFFER });

    expect(await summaryResponse).toEqual({
      totalCount: 34,
      activeCount: 16,
      scheduledCount: 14,
      endedCount: 4,
    });
    expect(await detailResponse).toEqual(toOfferDetail(LIVE_OFFER, TODAY));
  });

  it('pauses and resumes an offer with a POST each, and deletes one', async () => {
    const paused = firstValueFrom(repository.pauseOffer('2'));
    const resumed = firstValueFrom(repository.resumeOffer('3'));
    const deleted = firstValueFrom(repository.deleteOffer('4'), { defaultValue: 'none' });

    const pause = http.expectOne(`${OFFERS_URL}/2/pause`);
    const resume = http.expectOne(`${OFFERS_URL}/3/resume`);
    const remove = http.expectOne(`${OFFERS_URL}/4`);
    expect([pause.request.method, resume.request.method, remove.request.method]).toEqual([
      'POST',
      'POST',
      'DELETE',
    ]);
    pause.flush({ data: { ...LIVE_OFFER, status: 'inactive' } });
    resume.flush({ data: LIVE_OFFER });
    remove.flush({ data: null });

    expect((await paused).status).toBe('paused');
    expect((await resumed).status).toBe('active');
    expect(await deleted).toBeUndefined();
  });

  it('downloads the export as a file with the same filters and no page', async () => {
    const response = firstValueFrom(
      repository.exportOffers({ pageIndex: 2, pageSize: 4, search: 'خصم' }),
    );

    const request = http.expectOne((candidate) => candidate.url === `${OFFERS_URL}/export`);
    expect(request.request.responseType).toBe('blob');
    expect(request.request.params.get('search')).toBe('خصم');
    expect(request.request.params.has('page')).toBe(false);
    request.flush(new Blob(['csv']));
    expect(await response).toBeInstanceOf(Blob);
  });

  it('builds the form options from the offer stores and the store categories', async () => {
    const response = firstValueFrom(repository.getFormOptions());

    http
      .expectOne(`${OFFERS_URL}/formoptions`)
      .flush({ data: { stores: [{ id: 4, name: 'متجر السعادة' }] } });
    http
      .expectOne(`${STORES_URL}/formoptions`)
      .flush({ data: { mainCategories: [{ id: '1', name: 'مطاعم' }] } });

    expect(await response).toEqual({
      places: [{ id: '4', name: 'متجر السعادة', categoryName: '', address: '' }],
      categoryNames: ['مطاعم'],
    });
  });

  it('reads the items of a store', async () => {
    const items = [{ id: '1', name: 'مرتديلا', price: 100, currency: 'SYP' }];
    const response = firstValueFrom(repository.getPlaceItems('4'));

    http.expectOne(`${STORES_URL}/4/offer-items`).flush({ data: items });

    expect(await response).toEqual(items);
  });

  it('creates with a POST, and updates with a POST that names PUT, since PHP reads no form data on PUT', async () => {
    const created = firstValueFrom(repository.createOffer(buildOfferDraft({ placeId: '4' })));
    const updated = firstValueFrom(repository.updateOffer('2', buildOfferDraft({ placeId: '4' })));

    const create = http.expectOne(OFFERS_URL);
    const update = http.expectOne(`${OFFERS_URL}/2`);
    expect([create.request.method, update.request.method]).toEqual(['POST', 'POST']);
    expect((create.request.body as FormData).get('store_id')).toBe('4');
    expect((create.request.body as FormData).has('_method')).toBe(false);
    expect((update.request.body as FormData).get('_method')).toBe('PUT');
    create.flush({ data: { ...LIVE_OFFER, id: '7', store_id: '4' } });
    update.flush({ data: LIVE_OFFER });

    expect((await created).id).toBe('7');
    expect((await updated).id).toBe('2');
  });
});
