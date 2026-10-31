import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CLOCK } from '../../../core/config/clock';
import { buildOfferDraftFields } from '../testing/merchant-offer-fixture';
import { LiveOwnerOffer } from './live-owner-offer';
import { MerchantOfferHttpRepository } from './merchant-offer-http.repository';

const OFFERS_URL = 'https://api.test/owner/offers';
const ONE_PAGE = { current_page: 1, last_page: 1 };

function buildLiveOffer(overrides: Partial<LiveOwnerOffer> = {}): LiveOwnerOffer {
  return {
    id: '42',
    productId: '23',
    scope: { type: 'single_product', productId: '23' },
    title: 'خصم 30%',
    description: 'خصم على كامل التشكيلة.',
    imageUrl: null,
    discountPercentage: 30,
    startsAt: '2026-10-20T00:00:00+00:00',
    endsAt: '2026-11-15T00:00:00+00:00',
    status: 'active',
    createdAt: '2026-10-19T06:37:28+00:00',
    ...overrides,
  };
}

describe('MerchantOfferHttpRepository', () => {
  let repository: MerchantOfferHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MerchantOfferHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'https://api.test' },
        { provide: CLOCK, useValue: () => new Date('2026-10-29T10:00:00Z') },
      ],
    });
    repository = TestBed.inject(MerchantOfferHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('reads every offer with the plan and its limit from the summary', async () => {
    const response = firstValueFrom(repository.getCatalog());

    http.expectOne(`${OFFERS_URL}/summary`).flush({
      data: { plan: { id: '1', name: 'الباقة الذهبية' }, quota: { limit: 5 } },
    });
    http
      .expectOne((one) => one.url === OFFERS_URL)
      .flush({ data: [buildLiveOffer()], meta: ONE_PAGE });

    const catalog = await response;
    expect(catalog.plan).toEqual({ id: '1', name: 'الباقة الذهبية' });
    expect(catalog.activeOfferLimit).toBe(5);
    expect(catalog.items).toEqual([
      {
        id: '42',
        title: 'خصم 30%',
        description: 'خصم على كامل التشكيلة.',
        discountPercent: 30,
        scope: 'selectedItems',
        itemIds: ['23'],
        startsOn: '2026-10-20',
        endsOn: '2026-11-15',
        status: 'active',
        imageUrl: null,
        createdAt: '2026-10-19T06:37:28+00:00',
      },
    ]);
  });

  it('works out paused, scheduled and expired from the on/off flag and the days', async () => {
    const response = firstValueFrom(repository.getCatalog());

    http.expectOne(`${OFFERS_URL}/summary`).flush({ data: { plan: null, quota: { limit: 0 } } });
    http
      .expectOne((one) => one.url === OFFERS_URL)
      .flush({
        data: [
          buildLiveOffer({ id: '1', status: 'inactive' }),
          buildLiveOffer({ id: '2', startsAt: '2026-11-20T00:00:00+00:00' }),
          buildLiveOffer({ id: '3', endsAt: '2026-10-28T00:00:00+00:00' }),
          buildLiveOffer({
            id: '4',
            productId: null,
            scope: { type: 'all_products', productId: null },
            description: '',
          }),
        ],
        meta: ONE_PAGE,
      });

    const items = (await response).items;
    expect(items.map((offer) => offer.status)).toEqual([
      'paused',
      'scheduled',
      'expired',
      'active',
    ]);
    expect(items[3].scope).toBe('allItems');
    expect(items[3].itemIds).toEqual([]);
    expect(items[3].description).toBeNull();
  });

  it('reads one offer for the edit page', async () => {
    const response = firstValueFrom(repository.getOffer('42'));

    http.expectOne(`${OFFERS_URL}/42`).flush({ status_code: 200, data: buildLiveOffer() });
    expect((await response).id).toBe('42');
  });

  it("lists every one of the place's products as the items an offer can cover", async () => {
    const response = firstValueFrom(repository.getItems());

    http
      .expectOne((one) => one.url === 'https://api.test/owner/products')
      .flush({
        data: [
          {
            id: '23',
            name: { ar: 'مرطب' },
            price: 200,
            currencyCode: 'syp',
            imageUrl: null,
            status: 'active',
            updatedAt: '',
          },
        ],
        meta: ONE_PAGE,
      });
    expect(await response).toEqual([{ id: '23', name: 'مرطب', price: 200, currency: 'SYP' }]);
  });

  it('adds an offer with the title in both languages and the first picked product', async () => {
    const response = firstValueFrom(repository.createOffer(buildOfferDraftFields()));

    const request = http.expectOne(OFFERS_URL);
    expect(request.request.method).toBe('POST');
    const body = request.request.body as FormData;
    expect(body.get('title[ar]')).toBe('خصم 30% على جميع المنتجات');
    expect(body.get('title[en]')).toBe('خصم 30% على جميع المنتجات');
    expect(body.get('description[ar]')).toBe('خصم على كامل التشكيلة.');
    expect(body.get('discountPercentage')).toBe('30');
    expect(body.get('startsAt')).toBe('2026-09-01');
    expect(body.get('endsAt')).toBe('2026-09-30');
    expect(body.get('status')).toBe('active');
    expect(body.get('productId')).toBe('product-1');
    expect(body.has('_method')).toBe(false);
    request.flush({ status_code: 201, data: buildLiveOffer({ id: '9' }) });
    expect((await response).id).toBe('9');
  });

  it('saves a draft or a paused offer as inactive, and an offer on everything with no product', async () => {
    const response = firstValueFrom(
      repository.createOffer(
        buildOfferDraftFields({ status: 'draft', scope: 'allItems', description: '' }),
      ),
    );

    const request = http.expectOne(OFFERS_URL);
    const body = request.request.body as FormData;
    expect(body.get('status')).toBe('inactive');
    expect(body.has('productId')).toBe(false);
    expect(body.has('description[ar]')).toBe(false);
    request.flush({ data: buildLiveOffer() });
    await response;
  });

  it('saves a changed offer as POST with _method=PUT on its id', async () => {
    const response = firstValueFrom(repository.updateOffer('9', buildOfferDraftFields()));

    const request = http.expectOne(`${OFFERS_URL}/9`);
    expect(request.request.method).toBe('POST');
    expect((request.request.body as FormData).get('_method')).toBe('PUT');
    request.flush({ data: buildLiveOffer({ id: '9' }) });
    expect((await response).id).toBe('9');
  });

  it('pauses and resumes with a POST on the offer', async () => {
    const paused = firstValueFrom(repository.pauseOffer('42'));
    const pause = http.expectOne(`${OFFERS_URL}/42/pause`);
    expect(pause.request.method).toBe('POST');
    pause.flush({ data: buildLiveOffer({ status: 'inactive' }) });
    expect((await paused).status).toBe('paused');

    const resumed = firstValueFrom(repository.resumeOffer('42'));
    http.expectOne(`${OFFERS_URL}/42/resume`).flush({ data: buildLiveOffer() });
    expect((await resumed).status).toBe('active');
  });

  it('deletes an offer', async () => {
    const response = firstValueFrom(repository.deleteOffer('42'), { defaultValue: undefined });

    const request = http.expectOne(`${OFFERS_URL}/42`);
    expect(request.request.method).toBe('DELETE');
    request.flush({ status_code: 200, data: null });
    await response;
  });
});
