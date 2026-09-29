import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import {
  buildDeliveryPlatform,
  buildDeliveryPlatformDraft,
  buildDeliveryPlatformSummary,
  buildLinkedStore,
} from '../testing/delivery-platform-fixture';
import { DeliveryPlatformHttpRepository } from './delivery-platform-http.repository';

const PLATFORMS_URL = 'https://api.test/delivery-platforms';

describe('DeliveryPlatformHttpRepository', () => {
  let repository: DeliveryPlatformHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DeliveryPlatformHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'https://api.test' },
      ],
    });
    repository = TestBed.inject(DeliveryPlatformHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('reads one page with the search and the sort', async () => {
    const response = firstValueFrom(
      repository.getPlatforms({ pageIndex: 1, pageSize: 4, search: 'طلبات', sort: 'name' }),
    );

    const request = http.expectOne((candidate) => candidate.url === PLATFORMS_URL);
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('pageIndex')).toBe('1');
    expect(request.request.params.get('pageSize')).toBe('4');
    expect(request.request.params.get('search')).toBe('طلبات');
    expect(request.request.params.get('sort')).toBe('name');
    request.flush({ items: [buildDeliveryPlatform()], totalCount: 1 });
    expect((await response).totalCount).toBe(1);
  });

  it('reads the numbers of the four cards', async () => {
    const response = firstValueFrom(repository.getSummary());

    const request = http.expectOne(`${PLATFORMS_URL}/summary`);
    expect(request.request.method).toBe('GET');
    request.flush(buildDeliveryPlatformSummary());
    expect((await response).activeCount).toBe(6);
  });

  it('adds a platform with a multipart POST', async () => {
    const response = firstValueFrom(repository.createPlatform(buildDeliveryPlatformDraft()));

    const request = http.expectOne(PLATFORMS_URL);
    expect(request.request.method).toBe('POST');
    expect((request.request.body as FormData).get('latinName')).toBe('talabat');
    request.flush(buildDeliveryPlatform({ id: '9' }));
    expect((await response).id).toBe('9');
  });

  it('saves a platform with a multipart PUT on its id', async () => {
    const response = firstValueFrom(repository.updatePlatform('9', buildDeliveryPlatformDraft()));

    const request = http.expectOne(`${PLATFORMS_URL}/9`);
    expect(request.request.method).toBe('PUT');
    expect((request.request.body as FormData).get('name')).toBe('طلبات');
    request.flush(buildDeliveryPlatform({ id: '9' }));
    expect((await response).id).toBe('9');
  });

  it('switches a platform on or off with a PATCH', async () => {
    const response = firstValueFrom(repository.setPlatformStatus('9', 'suspended'));

    const request = http.expectOne(`${PLATFORMS_URL}/9/status`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ status: 'suspended' });
    request.flush(buildDeliveryPlatform({ id: '9', status: 'suspended' }));
    expect((await response).status).toBe('suspended');
  });

  it('deletes a platform by its id', async () => {
    const response = firstValueFrom(repository.deletePlatform('9'), { defaultValue: undefined });

    const request = http.expectOne(`${PLATFORMS_URL}/9`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null, { status: 204, statusText: 'No Content' });
    await response;
  });

  it('reads the stores linked to one platform', async () => {
    const response = firstValueFrom(repository.getLinkedStores('9'));

    const request = http.expectOne(`${PLATFORMS_URL}/9/stores`);
    expect(request.request.method).toBe('GET');
    request.flush([buildLinkedStore()]);
    expect((await response)[0].name).toBe('مطعم المدينة');
  });
});
