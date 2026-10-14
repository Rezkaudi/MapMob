import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CLOCK } from '../../../core/config/clock';
import { buildLiveDeliveryPlatform } from '../../../shared/testing/live-delivery-platform-fixture';
import { LIVE_GOLD_PLAN } from '../../../shared/testing/live-plan-fixture';
import { buildLiveStoreDeliveryLink } from '../../../shared/testing/live-store-delivery-link-fixture';
import { LIVE_PLACE_FORM_OPTIONS } from '../testing/live-place-choices-fixture';
import { buildPlaceSaveRequest } from '../testing/place-save-request-fixture';
import { PlaceHttpRepository } from './place-http.repository';
import { PlaceWriter } from './place-writer';

const BASE_URL = 'https://api.test';
const STORES_URL = `${BASE_URL}/admin/stores`;
const PLANS_URL = `${BASE_URL}/admin/plans`;
const PLATFORMS_URL = `${BASE_URL}/admin/deliveryplatforms`;
const TAWSEEL = buildLiveDeliveryPlatform({ id: 1, name: 'tawseel' });

const LIVE_ROW = {
  id: '4',
  code: 'PL-0004',
  name: 'happy store',
  publicUrl: null,
  logoUrl: null,
  category: null,
  governorate: null,
  rating: 4,
  reviewCount: 0,
  status: 'active',
  planTier: 'free',
  createdAt: '2026-10-03T19:59:36Z',
};

describe('PlaceHttpRepository', () => {
  let repository: PlaceHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlaceHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
        { provide: CLOCK, useValue: () => new Date('2026-10-11T10:00:00Z') },
      ],
    });
    repository = TestBed.inject(PlaceHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  function answerPlans(): void {
    http.expectOne(PLANS_URL).flush({ data: [LIVE_GOLD_PLAN] });
  }

  function answerPlatforms(): void {
    http
      .expectOne((candidate) => candidate.url === PLATFORMS_URL)
      .flush({ data: [TAWSEEL], meta: { current_page: 1, last_page: 1 } });
  }

  function answerList(path: string, rows: readonly object[]): void {
    http
      .expectOne((candidate) => candidate.url === `${BASE_URL}/admin/${path}`)
      .flush({ data: rows, meta: { current_page: 1, last_page: 1 } });
  }

  it('asks the stores route for a page with the server filter names', async () => {
    const response = firstValueFrom(
      repository.getPlaces({
        pageIndex: 1,
        pageSize: 8,
        search: 'happy',
        status: 'suspended',
        category: '9',
        package: 'free',
        sort: 'name',
      }),
    );

    answerPlans();
    const request = http.expectOne((candidate) => candidate.url === STORES_URL);
    const params = request.request.params;
    expect(params.get('page')).toBe('2');
    expect(params.get('per_page')).toBe('8');
    expect(params.get('search')).toBe('happy');
    expect(params.get('status')).toBe('inactive');
    expect(params.get('category_id')).toBe('9');
    expect(params.get('plan_tier')).toBe('free');
    expect(params.get('sort_by')).toBe('name_asc');
    request.flush({ items: [], totalCount: 0 });

    expect(await response).toEqual({ items: [], totalCount: 0 });
  });

  it('filters by the slug of the premium plan and reads it back as premium', async () => {
    const response = firstValueFrom(
      repository.getPlaces({ pageIndex: 0, pageSize: 8, package: 'premium' }),
    );

    answerPlans();
    const request = http.expectOne((candidate) => candidate.url === STORES_URL);
    expect(request.request.params.get('plan_tier')).toBe('golden-plan');
    request.flush({ items: [{ ...LIVE_ROW, planTier: 'golden-plan' }], totalCount: 1 });

    expect((await response).items[0].package).toBe('premium');
  });

  it('loads the plans once for many pages', () => {
    repository.getPlaces({ pageIndex: 0, pageSize: 8 }).subscribe();
    answerPlans();
    http.expectOne((candidate) => candidate.url === STORES_URL).flush({ items: [], totalCount: 0 });

    repository.getPlaces({ pageIndex: 1, pageSize: 8 }).subscribe();
    http.expectNone(PLANS_URL);
    http.expectOne((candidate) => candidate.url === STORES_URL).flush({ items: [], totalCount: 0 });
  });

  it('asks for the best rated first, and sends no sort for newest', () => {
    repository.getPlaces({ pageIndex: 0, pageSize: 8, sort: 'rating' }).subscribe();
    repository.getPlaces({ pageIndex: 0, pageSize: 8, sort: 'newest' }).subscribe();
    answerPlans();

    const [byRating, newest] = http.match((candidate) => candidate.url === STORES_URL);
    expect(byRating.request.params.get('sort_by')).toBe('rating_desc');
    expect(newest.request.params.has('sort_by')).toBe(false);
    byRating.flush({ items: [], totalCount: 0 });
    newest.flush({ items: [], totalCount: 0 });
  });

  it('reads the status counts', async () => {
    const counts = { all: 4, active: 3, suspended: 1, pending: 0 };
    const response = firstValueFrom(repository.getStatusCounts());

    http.expectOne(`${BASE_URL}/admin/places/statuscounts`).flush({ data: counts });

    expect(await response).toEqual(counts);
  });

  it('reads one place', async () => {
    const response = firstValueFrom(repository.getPlace('1'));
    answerPlans();

    http.expectOne(`${STORES_URL}/1`).flush({
      data: {
        id: '1',
        code: 'PL-0001',
        name: 'متجر',
        status: 'active',
        mainCategory: null,
        subCategory: null,
        isOpenNow: false,
        owner: null,
        contact: null,
        location: null,
        workingHours: [],
        subscription: null,
        images: [],
        videos: [],
        products: [],
        offers: [],
        createdAt: '2026-10-03T19:59:36+00:00',
        updatedAt: '2026-10-11T09:00:00+00:00',
      },
    });
    http
      .expectOne(`${STORES_URL}/1/delivery-links`)
      .flush({ data: [buildLiveStoreDeliveryLink({ url: 'https://tawseel.com/1' })] });
    answerPlatforms();

    const place = await response;
    expect(place.name).toBe('متجر');
    expect(place.deliveryLinks.map((link) => [link.platform.name, link.storeUrl])).toEqual([
      ['tawseel', 'https://tawseel.com/1'],
    ]);
  });

  it('suspends places with the word the server keeps for it', async () => {
    const response = firstValueFrom(repository.setPlacesStatus(['1', '2'], 'suspended'));

    const request = http.expectOne({ method: 'PATCH', url: `${STORES_URL}/status` });
    expect(request.request.body).toEqual({ ids: ['1', '2'], status: 'inactive' });
    request.flush({ updatedCount: 2 });

    await response;
  });

  it('deletes the named places in one call', async () => {
    const response = firstValueFrom(repository.deletePlaces(['1']));

    const request = http.expectOne({ method: 'DELETE', url: STORES_URL });
    expect(request.request.body).toEqual({ ids: ['1'] });
    request.flush({});

    await response;
  });

  it('asks the export route for a file, naming the ticked rows', async () => {
    const response = firstValueFrom(
      repository.exportPlaces({
        query: { pageIndex: 0, pageSize: 8, category: '9' },
        ids: ['1', '2'],
      }),
    );

    answerPlans();
    const request = http.expectOne((candidate) => candidate.url === `${STORES_URL}/export`);
    expect(request.request.responseType).toBe('blob');
    expect(request.request.params.get('category_id')).toBe('9');
    expect(request.request.params.getAll('ids[]')).toEqual(['1', '2']);
    expect(request.request.params.has('page')).toBe(false);
    request.flush(new Blob(['name']));

    expect(await response).toBeInstanceOf(Blob);
  });

  it('reads the form choices from the store form options and the admin platforms', async () => {
    const response = firstValueFrom(repository.getPlaceFormChoices());

    http.expectOne(`${STORES_URL}/formoptions`).flush({ data: LIVE_PLACE_FORM_OPTIONS });
    answerPlatforms();

    const choices = await response;
    expect(choices.governorates[0].areas[0].name).toBe('tartus city');
    expect(choices.deliveryPlatforms.map((platform) => platform.id)).toEqual(['1']);
  });

  it('builds the choices from the category, region and city lists when the form options fail', async () => {
    const response = firstValueFrom(repository.getPlaceFormChoices());

    http
      .expectOne(`${STORES_URL}/formoptions`)
      .flush({ message: 'Column not found' }, { status: 500, statusText: 'Server Error' });
    answerPlatforms();
    answerList('categories', [{ id: 8, parent_id: null, name: 'صيدلية' }]);
    answerList('regions', [{ id: 6, name: { ar: 'طرطوس', en: 'Tartous' } }]);
    answerList('cities', [{ id: 7, region_id: 6, name: 'tartus city' }]);

    const choices = await response;
    expect(choices.mainCategories.map((category) => category.name)).toEqual(['صيدلية']);
    expect(choices.governorates[0].areas).toEqual([{ id: '7', name: 'tartus city' }]);
  });

  it('saves a place through the writer with the form choices and the plans', async () => {
    const saves: unknown[] = [];
    TestBed.inject(PlaceWriter).save = (...args: unknown[]) => {
      saves.push(args);
      return of('52');
    };
    const request = buildPlaceSaveRequest();
    const response = firstValueFrom(repository.savePlace(null, request));

    http.expectOne(`${STORES_URL}/formoptions`).flush({ data: LIVE_PLACE_FORM_OPTIONS });
    answerPlatforms();
    answerPlans();

    expect(await response).toBe('52');
    expect(saves).toHaveLength(1);
  });

  it('reads the category filter choices from the form options', async () => {
    const response = firstValueFrom(repository.getCategoryOptions());

    http.expectOne(`${STORES_URL}/formoptions`).flush({
      data: { mainCategories: [{ id: '9', name: 'متجر', subCategories: [] }], governorates: [] },
    });

    expect(await response).toEqual([{ value: '9', label: 'متجر' }]);
  });
});
