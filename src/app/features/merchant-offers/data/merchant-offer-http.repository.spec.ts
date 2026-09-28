import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { buildMerchantProductCatalog } from '../../merchant-products/testing/merchant-product-fixture';
import {
  buildMerchantOffer,
  buildMerchantOfferCatalog,
  buildOfferDraftFields,
} from '../testing/merchant-offer-fixture';
import { MerchantOfferHttpRepository } from './merchant-offer-http.repository';

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
      ],
    });
    repository = TestBed.inject(MerchantOfferHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it("reads the owner's offers with the plan limit", async () => {
    const response = firstValueFrom(repository.getCatalog());

    const request = http.expectOne('https://api.test/owner/offers');
    expect(request.request.method).toBe('GET');
    request.flush(buildMerchantOfferCatalog());
    expect((await response).activeOfferLimit).toBe(5);
  });

  it('reads one offer for the edit page', async () => {
    const response = firstValueFrom(repository.getOffer('offer-1'));

    http.expectOne('https://api.test/owner/offers/offer-1').flush(buildMerchantOffer());
    expect((await response).id).toBe('offer-1');
  });

  it("lists the place's own products as the items an offer can cover", async () => {
    const response = firstValueFrom(repository.getItems());

    const request = http.expectOne('https://api.test/owner/products');
    expect(request.request.method).toBe('GET');
    request.flush(buildMerchantProductCatalog());
    expect(await response).toEqual([
      { id: 'product-1', name: 'مرطب dove', price: 200, currency: 'SYP' },
    ]);
  });

  it('adds an offer with a multipart POST', async () => {
    const response = firstValueFrom(repository.createOffer(buildOfferDraftFields()));

    const request = http.expectOne('https://api.test/owner/offers');
    expect(request.request.method).toBe('POST');
    expect((request.request.body as FormData).get('title')).toBe('خصم 30% على جميع المنتجات');
    expect((request.request.body as FormData).has('placeId')).toBe(false);
    request.flush(buildMerchantOffer({ id: 'offer-9' }));
    expect((await response).id).toBe('offer-9');
  });

  it('saves a changed offer with a multipart PUT on its id', async () => {
    const response = firstValueFrom(repository.updateOffer('offer-9', buildOfferDraftFields()));

    const request = http.expectOne('https://api.test/owner/offers/offer-9');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body instanceof FormData).toBe(true);
    request.flush(buildMerchantOffer({ id: 'offer-9' }));
    expect((await response).id).toBe('offer-9');
  });

  it('pauses and resumes with a POST on the offer', async () => {
    const paused = firstValueFrom(repository.pauseOffer('offer-1'));
    const pause = http.expectOne('https://api.test/owner/offers/offer-1/pause');
    expect(pause.request.method).toBe('POST');
    pause.flush(buildMerchantOffer({ status: 'paused' }));
    expect((await paused).status).toBe('paused');

    const resumed = firstValueFrom(repository.resumeOffer('offer-1'));
    const resume = http.expectOne('https://api.test/owner/offers/offer-1/resume');
    expect(resume.request.method).toBe('POST');
    resume.flush(buildMerchantOffer());
    expect((await resumed).status).toBe('active');
  });

  it('deletes an offer', async () => {
    const response = firstValueFrom(repository.deleteOffer('offer-1'));

    const request = http.expectOne('https://api.test/owner/offers/offer-1');
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
    await response;
  });
});
