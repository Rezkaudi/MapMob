import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveDeliveryPlatform } from '../../../shared/data/live-delivery-platform';
import { buildLiveDeliveryPlatform } from '../../../shared/testing/live-delivery-platform-fixture';
import { buildLiveStoreDeliveryLink } from '../../../shared/testing/live-store-delivery-link-fixture';
import { buildDeliveryPlatformDraft } from '../testing/delivery-platform-fixture';
import { DeliveryPlatformHttpRepository } from './delivery-platform-http.repository';

const PLATFORMS_URL = 'https://api.test/admin/deliveryplatforms';
const STORES_URL = 'https://api.test/admin/stores';

function livePage(rows: readonly unknown[], currentPage = 1, lastPage = 1) {
  return {
    data: rows,
    meta: { current_page: currentPage, last_page: lastPage, total: rows.length },
  };
}

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

  function answerPlatform(id: string, platform: LiveDeliveryPlatform): void {
    const request = http.expectOne(`${PLATFORMS_URL}/${id}`);
    expect(request.request.method).toBe('GET');
    request.flush({ data: platform });
  }

  it('does not keep a web address', () => {
    expect(repository.keepsWebsiteUrl).toBe(false);
  });

  it('reads every page, then searches and pages here, as the server ignores both', async () => {
    const response = firstValueFrom(
      repository.getPlatforms({ pageIndex: 0, pageSize: 1, search: 'tal' }),
    );

    const first = http.expectOne((candidate) => candidate.url === PLATFORMS_URL);
    expect(first.request.params.get('page')).toBe('1');
    first.flush(livePage([buildLiveDeliveryPlatform({ id: 1, name: 'tawseel' })], 1, 2));
    const second = http.expectOne((candidate) => candidate.url === PLATFORMS_URL);
    expect(second.request.params.get('page')).toBe('2');
    second.flush(
      livePage(
        [
          buildLiveDeliveryPlatform({ id: 2, name: 'talabat', sort_order: 2 }),
          buildLiveDeliveryPlatform({ id: 3, name: 'Talabat Mart', sort_order: 3 }),
        ],
        2,
        2,
      ),
    );

    const page = await response;
    expect(page.totalCount).toBe(2);
    expect(page.items.map((platform) => platform.id)).toEqual(['2']);
  });

  it('reads the active and total counts', async () => {
    const response = firstValueFrom(repository.getSummary());

    http.expectOne(`${PLATFORMS_URL}/summary`).flush({
      status: true,
      data: { total: 4, active: 3, inactive: 1 },
    });

    const summary = await response;
    expect([summary.activeCount, summary.platformCount]).toEqual([3, 4]);
  });

  it('adds a platform with a multipart POST', async () => {
    const response = firstValueFrom(repository.createPlatform(buildDeliveryPlatformDraft()));

    const request = http.expectOne(PLATFORMS_URL);
    expect(request.request.method).toBe('POST');
    expect((request.request.body as FormData).get('name[ar]')).toBe('طلبات');
    request.flush({ data: buildLiveDeliveryPlatform({ id: 9 }) });
    expect((await response).id).toBe('9');
  });

  it('reads the saved platform first, so an untouched Arabic name is not replaced', async () => {
    const response = firstValueFrom(
      repository.updatePlatform('9', buildDeliveryPlatformDraft({ name: 'tawseel' })),
    );

    answerPlatform('9', buildLiveDeliveryPlatform({ id: 9, name: 'tawseel' }));
    const request = http.expectOne(`${PLATFORMS_URL}/9`);
    expect(request.request.method).toBe('POST');
    const form = request.request.body as FormData;
    expect(form.get('_method')).toBe('PUT');
    expect(form.has('name[ar]')).toBe(false);
    request.flush({ data: buildLiveDeliveryPlatform({ id: 9 }) });
    expect((await response).id).toBe('9');
  });

  it('flips the switch only when the platform is not already in that state', async () => {
    const response = firstValueFrom(repository.setPlatformStatus('9', 'suspended'));

    answerPlatform('9', buildLiveDeliveryPlatform({ id: 9, is_active: true }));
    const request = http.expectOne(`${PLATFORMS_URL}/9/status`);
    expect(request.request.method).toBe('PATCH');
    request.flush({ data: buildLiveDeliveryPlatform({ id: 9, is_active: false }) });
    expect((await response).status).toBe('suspended');
  });

  it('sends nothing when the platform is already in that state', async () => {
    const response = firstValueFrom(repository.setPlatformStatus('9', 'active'));

    answerPlatform('9', buildLiveDeliveryPlatform({ id: 9, is_active: true }));

    expect((await response).status).toBe('active');
  });

  it('deletes a platform by its id', async () => {
    const response = firstValueFrom(repository.deletePlatform('9'), { defaultValue: undefined });

    const request = http.expectOne(`${PLATFORMS_URL}/9`);
    expect(request.request.method).toBe('DELETE');
    request.flush({ status: true });
    await response;
  });

  it('builds each linked store from its page and its link to this platform', async () => {
    const response = firstValueFrom(repository.getLinkedStores('9'));

    http
      .expectOne((candidate) => candidate.url === `${PLATFORMS_URL}/9/stores`)
      .flush(livePage([{ id: 4 }]));
    http.expectOne(`${STORES_URL}/4`).flush({
      data: {
        id: '4',
        name: 'مطعم المدينة',
        logoUrl: null,
        mainCategory: { id: '1', name: 'مطاعم' },
        location: { governorate: { id: '1', name: 'دمشق' }, area: null },
      },
    });
    http.expectOne(`${STORES_URL}/4/delivery-links`).flush({
      data: [
        buildLiveStoreDeliveryLink({ deliveryPlatformId: '2', url: 'https://other.test' }),
        buildLiveStoreDeliveryLink({ deliveryPlatformId: '9', url: 'https://tawseel.test/4' }),
      ],
    });

    const [store] = await response;
    expect(store.name).toBe('مطعم المدينة');
    expect(store.storeUrl).toBe('https://tawseel.test/4');
  });

  it('answers an empty list without asking for store pages', async () => {
    const response = firstValueFrom(repository.getLinkedStores('9'));

    http
      .expectOne((candidate) => candidate.url === `${PLATFORMS_URL}/9/stores`)
      .flush(livePage([]));

    expect(await response).toEqual([]);
  });
});
