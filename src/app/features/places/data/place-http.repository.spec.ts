import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CLOCK } from '../../../core/config/clock';
import { PlaceHttpRepository } from './place-http.repository';

const BASE_URL = 'https://api.test';
const STORES_URL = `${BASE_URL}/admin/stores`;

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

  it('asks for the best rated first, and sends no sort for newest', () => {
    repository.getPlaces({ pageIndex: 0, pageSize: 8, sort: 'rating' }).subscribe();
    repository.getPlaces({ pageIndex: 0, pageSize: 8, sort: 'newest' }).subscribe();

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
        deliveryLinks: [],
        createdAt: '2026-10-03T19:59:36+00:00',
        updatedAt: '2026-10-11T09:00:00+00:00',
      },
    });

    expect((await response).name).toBe('متجر');
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

    const request = http.expectOne((candidate) => candidate.url === `${STORES_URL}/export`);
    expect(request.request.responseType).toBe('blob');
    expect(request.request.params.get('category_id')).toBe('9');
    expect(request.request.params.getAll('ids[]')).toEqual(['1', '2']);
    expect(request.request.params.has('page')).toBe(false);
    request.flush(new Blob(['name']));

    expect(await response).toBeInstanceOf(Blob);
  });

  it('reads the category filter choices from the form options', async () => {
    const response = firstValueFrom(repository.getCategoryOptions());

    http.expectOne(`${STORES_URL}/formoptions`).flush({
      data: { mainCategories: [{ id: '9', name: 'متجر', subCategories: [] }], governorates: [] },
    });

    expect(await response).toEqual([{ value: '9', label: 'متجر' }]);
  });
});
