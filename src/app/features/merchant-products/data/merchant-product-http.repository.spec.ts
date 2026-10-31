import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { EMPTY_PRODUCT_DRAFT } from '../../../shared/models/empty-product-draft';
import { MerchantProductHttpRepository } from './merchant-product-http.repository';

const PRODUCTS_URL = 'https://api.test/owner/products';
const DRAFT = { ...EMPTY_PRODUCT_DRAFT, name: 'سيروم', price: 350 };
const LIVE_PRODUCT = {
  id: '9',
  name: { ar: 'سيروم', en: 'serum' },
  price: 350,
  currencyCode: 'syp',
  imageUrl: null,
  status: 'inactive',
  updatedAt: '2026-10-29T06:35:20+00:00',
};

describe('MerchantProductHttpRepository', () => {
  let repository: MerchantProductHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MerchantProductHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'https://api.test' },
      ],
    });
    repository = TestBed.inject(MerchantProductHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('reads every page of products with the plan and its limit from the summary', async () => {
    const response = firstValueFrom(repository.getCatalog());

    http.expectOne(`${PRODUCTS_URL}/summary`).flush({
      data: { plan: { id: '1', name: 'الباقة الذهبية', slug: 'gold' }, quota: { limit: 100 } },
    });
    const first = http.expectOne(
      (one) => one.url === PRODUCTS_URL && one.params.get('page') === '1',
    );
    expect(first.request.params.get('per_page')).toBe('50');
    first.flush({ data: [LIVE_PRODUCT], meta: { current_page: 1, last_page: 2 } });
    http
      .expectOne((one) => one.url === PRODUCTS_URL && one.params.get('page') === '2')
      .flush({ data: [{ ...LIVE_PRODUCT, id: '10' }], meta: { current_page: 2, last_page: 2 } });

    const catalog = await response;
    expect(catalog.plan).toEqual({ id: '1', name: 'الباقة الذهبية' });
    expect(catalog.productLimit).toBe(100);
    expect(catalog.items.map((item) => item.id)).toEqual(['9', '10']);
    expect(catalog.items[0]).toEqual({
      id: '9',
      name: 'سيروم',
      price: 350,
      currency: 'SYP',
      imageUrl: null,
      isAvailable: false,
      orderUrl: null,
      updatedAt: '2026-10-29T06:35:20+00:00',
    });
  });

  it('names the plan "بدون باقة" with no room while the place has no plan', async () => {
    const response = firstValueFrom(repository.getCatalog());

    http.expectOne(`${PRODUCTS_URL}/summary`).flush({ data: { plan: null, quota: { limit: 0 } } });
    http
      .expectOne((one) => one.url === PRODUCTS_URL)
      .flush({ data: [], meta: { current_page: 1, last_page: 1 } });

    const catalog = await response;
    expect(catalog.plan).toEqual({ id: '', name: 'بدون باقة' });
    expect(catalog.productLimit).toBe(0);
  });

  it('adds a product with the Arabic name, the currency code and the status', async () => {
    const response = firstValueFrom(repository.createProduct({ ...DRAFT, isAvailable: false }));

    const request = http.expectOne(PRODUCTS_URL);
    expect(request.request.method).toBe('POST');
    const body = request.request.body as FormData;
    expect(body.get('name[ar]')).toBe('سيروم');
    expect(body.get('price')).toBe('350');
    expect(body.get('currencyCode')).toBe('SYP');
    expect(body.get('status')).toBe('inactive');
    expect(body.has('_method')).toBe(false);
    request.flush({ status_code: 201, data: LIVE_PRODUCT });
    expect((await response).id).toBe('9');
  });

  it('saves a changed product as POST with _method=PUT on its id', async () => {
    const response = firstValueFrom(repository.updateProduct('9', DRAFT));

    const request = http.expectOne(`${PRODUCTS_URL}/9`);
    expect(request.request.method).toBe('POST');
    expect((request.request.body as FormData).get('_method')).toBe('PUT');
    expect((request.request.body as FormData).get('status')).toBe('active');
    request.flush({ data: { ...LIVE_PRODUCT, status: 'active' } });
    expect((await response).isAvailable).toBe(true);
  });

  it('deletes a product by its id', async () => {
    const response = firstValueFrom(repository.deleteProduct('9'), { defaultValue: undefined });

    const request = http.expectOne(`${PRODUCTS_URL}/9`);
    expect(request.request.method).toBe('DELETE');
    request.flush({ status_code: 200, data: null });
    await response;
  });
});
