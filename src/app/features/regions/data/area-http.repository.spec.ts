import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { AreaHttpRepository } from './area-http.repository';

const BASE_URL = 'https://api.test';
const CITIES_URL = `${BASE_URL}/admin/cities`;
const DRAFT = { name: 'الصالحية', status: 'active' as const };
const LIVE_CITY = {
  id: 7,
  region_id: 6,
  name: 'الصالحية',
  is_active: true,
  stores_count: 3,
  updated_at: '2026-10-08T09:38:58.000000Z',
};

describe('AreaHttpRepository', () => {
  let repository: AreaHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AreaHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    repository = TestBed.inject(AreaHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('asks the cities route for one governorate and turns the rows into areas', async () => {
    const response = firstValueFrom(
      repository.getAreas({ governorateId: '6', pageIndex: 0, pageSize: 5, search: 'صا' }),
    );

    const request = http.expectOne((candidate) => candidate.url === CITIES_URL);
    expect(request.request.params.get('region_id')).toBe('6');
    expect(request.request.params.get('page')).toBe('1');
    expect(request.request.params.get('per_page')).toBe('5');
    expect(request.request.params.get('search')).toBe('صا');
    request.flush({ data: [LIVE_CITY], meta: { total: 1 } });

    expect(await response).toEqual({
      items: [
        {
          id: '7',
          governorateId: '6',
          name: 'الصالحية',
          subAreaCount: 0,
          placeCount: 3,
          status: 'active',
          updatedAt: '2026-10-08T09:38:58.000000Z',
        },
      ],
      totalCount: 1,
    });
  });

  it('creates an area inside its governorate', () => {
    repository.createArea('6', DRAFT).subscribe();

    const request = http.expectOne({ method: 'POST', url: CITIES_URL });
    expect(request.request.body).toEqual({
      region_id: 6,
      name: { ar: 'الصالحية', en: 'الصالحية' },
      slug: 'الصالحية',
      is_active: true,
    });
    request.flush({ data: LIVE_CITY });
  });

  it('updates an area', () => {
    repository.updateArea('7', DRAFT).subscribe();

    const request = http.expectOne({ method: 'PUT', url: `${CITIES_URL}/7` });
    expect(request.request.body).toEqual({
      name: { ar: 'الصالحية', en: 'الصالحية' },
      is_active: true,
    });
    request.flush({ data: LIVE_CITY });
  });

  it('changes only the status of an area', () => {
    repository.setAreaStatus('7', 'suspended').subscribe();

    const request = http.expectOne({ method: 'PUT', url: `${CITIES_URL}/7` });
    expect(request.request.body).toEqual({ is_active: false });
    request.flush({ data: LIVE_CITY });
  });

  it('deletes an area', () => {
    repository.deleteArea('7').subscribe();

    http.expectOne({ method: 'DELETE', url: `${CITIES_URL}/7` }).flush({});
  });
});
