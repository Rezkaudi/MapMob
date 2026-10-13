import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { GovernorateHttpRepository } from './governorate-http.repository';

const BASE_URL = 'https://api.test';
const REGIONS_URL = `${BASE_URL}/admin/regions`;
const DRAFT = { name: 'طرطوس', status: 'active' as const };
const LIVE_REGION = {
  id: 6,
  name: { ar: 'محافظة طرطوس', en: 'Tartous' },
  is_active: false,
  cities_count: 2,
  stores_count: 5,
  updated_at: '2026-10-08T09:11:35.000000Z',
};
const GOVERNORATE = {
  id: '6',
  name: 'محافظة طرطوس',
  subAreaCount: 2,
  placeCount: 5,
  status: 'suspended',
  updatedAt: '2026-10-08T09:11:35.000000Z',
};

describe('GovernorateHttpRepository', () => {
  let repository: GovernorateHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GovernorateHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    repository = TestBed.inject(GovernorateHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('asks the regions route for a page and turns the rows into governorates', async () => {
    const response = firstValueFrom(
      repository.getGovernorates({ pageIndex: 1, pageSize: 5, search: 'حمص' }),
    );

    const request = http.expectOne((candidate) => candidate.url === REGIONS_URL);
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('per_page')).toBe('5');
    expect(request.request.params.get('search')).toBe('حمص');
    request.flush({ data: [LIVE_REGION], meta: { total: 11 } });

    expect(await response).toEqual({ items: [GOVERNORATE], totalCount: 11 });
  });

  it('reads one governorate', async () => {
    const response = firstValueFrom(repository.getGovernorate('6'));

    http.expectOne({ method: 'GET', url: `${REGIONS_URL}/6` }).flush({ data: LIVE_REGION });

    expect(await response).toEqual(GOVERNORATE);
  });

  it('creates a governorate with the one name in both languages', () => {
    repository.createGovernorate(DRAFT).subscribe();

    const request = http.expectOne({ method: 'POST', url: REGIONS_URL });
    expect(request.request.body).toEqual({
      name: { ar: 'طرطوس', en: 'طرطوس' },
      slug: 'طرطوس',
      is_active: true,
    });
    request.flush({ data: LIVE_REGION });
  });

  it('updates a governorate', () => {
    repository.updateGovernorate('6', { ...DRAFT, status: 'suspended' }).subscribe();

    const request = http.expectOne({ method: 'PUT', url: `${REGIONS_URL}/6` });
    expect(request.request.body).toEqual({
      name: { ar: 'طرطوس', en: 'طرطوس' },
      is_active: false,
    });
    request.flush({ data: LIVE_REGION });
  });

  it('changes only the status of a governorate', () => {
    repository.setGovernorateStatus('6', 'suspended').subscribe();

    const request = http.expectOne({ method: 'PUT', url: `${REGIONS_URL}/6` });
    expect(request.request.body).toEqual({ is_active: false });
    request.flush({ data: LIVE_REGION });
  });

  it('deletes a governorate', () => {
    repository.deleteGovernorate('6').subscribe();

    http.expectOne({ method: 'DELETE', url: `${REGIONS_URL}/6` }).flush({});
  });
});
