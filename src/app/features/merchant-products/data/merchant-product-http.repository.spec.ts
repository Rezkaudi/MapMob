import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { EMPTY_PRODUCT_DRAFT } from '../../../shared/models/empty-product-draft';
import {
  buildMerchantProduct,
  buildMerchantProductCatalog,
} from '../testing/merchant-product-fixture';
import { MerchantProductHttpRepository } from './merchant-product-http.repository';

const DRAFT = { ...EMPTY_PRODUCT_DRAFT, name: 'سيروم', price: 350 };

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

  it("reads the owner's products with the plan limit", async () => {
    const response = firstValueFrom(repository.getCatalog());

    const request = http.expectOne('https://api.test/owner/products');
    expect(request.request.method).toBe('GET');
    request.flush(buildMerchantProductCatalog());
    expect((await response).productLimit).toBe(5);
  });

  it('adds a product with a multipart POST', async () => {
    const response = firstValueFrom(repository.createProduct(DRAFT));

    const request = http.expectOne('https://api.test/owner/products');
    expect(request.request.method).toBe('POST');
    expect((request.request.body as FormData).get('name')).toBe('سيروم');
    request.flush(buildMerchantProduct({ id: '9', name: 'سيروم' }));
    expect((await response).id).toBe('9');
  });

  it('saves a changed product with a multipart PUT on its id', async () => {
    const response = firstValueFrom(repository.updateProduct('9', DRAFT));

    const request = http.expectOne('https://api.test/owner/products/9');
    expect(request.request.method).toBe('PUT');
    expect((request.request.body as FormData).get('isImageRemoved')).toBe('true');
    request.flush(buildMerchantProduct({ id: '9' }));
    expect((await response).id).toBe('9');
  });

  it('deletes a product by its id', async () => {
    const response = firstValueFrom(repository.deleteProduct('9'), { defaultValue: undefined });

    const request = http.expectOne('https://api.test/owner/products/9');
    expect(request.request.method).toBe('DELETE');
    request.flush(null, { status: 204, statusText: 'No Content' });
    await response;
  });
});
