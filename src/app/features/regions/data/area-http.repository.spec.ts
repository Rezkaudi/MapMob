import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { AreaHttpRepository } from './area-http.repository';

const BASE_URL = 'https://api.test';
const DRAFT = { name: 'صافيتا', status: 'active' as const };

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

  it('asks for a page of the areas inside one governorate', () => {
    repository
      .getAreas({ governorateId: 'gov-1', pageIndex: 0, pageSize: 5, search: 'صا', sort: 'oldest' })
      .subscribe();

    const request = http.expectOne(
      (candidate) => candidate.url === `${BASE_URL}/governorates/gov-1/areas`,
    );
    expect(request.request.params.get('pageSize')).toBe('5');
    expect(request.request.params.get('search')).toBe('صا');
    expect(request.request.params.get('sort')).toBe('oldest');
    request.flush({ items: [], totalCount: 0 });
  });

  it('creates an area inside its governorate', () => {
    repository.createArea('gov-1', DRAFT).subscribe();

    const request = http.expectOne({
      method: 'POST',
      url: `${BASE_URL}/governorates/gov-1/areas`,
    });
    expect(request.request.body).toEqual(DRAFT);
    request.flush({});
  });

  it('updates an area', () => {
    repository.updateArea('area-1', DRAFT).subscribe();

    const request = http.expectOne({ method: 'PUT', url: `${BASE_URL}/areas/area-1` });
    expect(request.request.body).toEqual(DRAFT);
    request.flush({});
  });

  it('changes the status of an area', () => {
    repository.setAreaStatus('area-1', 'active').subscribe();

    const request = http.expectOne({ method: 'PATCH', url: `${BASE_URL}/areas/area-1/status` });
    expect(request.request.body).toEqual({ status: 'active' });
    request.flush({});
  });

  it('deletes an area', () => {
    repository.deleteArea('area-1').subscribe();

    http.expectOne({ method: 'DELETE', url: `${BASE_URL}/areas/area-1` }).flush(null);
  });
});
