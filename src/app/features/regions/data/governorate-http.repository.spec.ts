import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { GovernorateHttpRepository } from './governorate-http.repository';

const BASE_URL = 'https://api.test';
const DRAFT = { name: 'طرطوس', status: 'active' as const };

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

  it('asks for a page of governorates with the search and sort', async () => {
    const response = firstValueFrom(
      repository.getGovernorates({ pageIndex: 1, pageSize: 5, search: 'حمص', sort: 'name' }),
    );

    const request = http.expectOne((candidate) => candidate.url === `${BASE_URL}/governorates`);
    expect(request.request.params.get('pageIndex')).toBe('1');
    expect(request.request.params.get('pageSize')).toBe('5');
    expect(request.request.params.get('search')).toBe('حمص');
    expect(request.request.params.get('sort')).toBe('name');
    request.flush({ items: [], totalCount: 0 });

    expect(await response).toEqual({ items: [], totalCount: 0 });
  });

  it('leaves out an empty search and sort', () => {
    repository.getGovernorates({ pageIndex: 0, pageSize: 5 }).subscribe();

    const request = http.expectOne((candidate) => candidate.url === `${BASE_URL}/governorates`);
    expect(request.request.params.has('search')).toBe(false);
    expect(request.request.params.has('sort')).toBe(false);
    request.flush({ items: [], totalCount: 0 });
  });

  it('reads one governorate', () => {
    repository.getGovernorate('gov-1').subscribe();

    http.expectOne({ method: 'GET', url: `${BASE_URL}/governorates/gov-1` }).flush({});
  });

  it('creates a governorate', () => {
    repository.createGovernorate(DRAFT).subscribe();

    const request = http.expectOne({ method: 'POST', url: `${BASE_URL}/governorates` });
    expect(request.request.body).toEqual(DRAFT);
    request.flush({});
  });

  it('updates a governorate', () => {
    repository.updateGovernorate('gov-1', DRAFT).subscribe();

    const request = http.expectOne({ method: 'PUT', url: `${BASE_URL}/governorates/gov-1` });
    expect(request.request.body).toEqual(DRAFT);
    request.flush({});
  });

  it('changes the status of a governorate', () => {
    repository.setGovernorateStatus('gov-1', 'suspended').subscribe();

    const request = http.expectOne({
      method: 'PATCH',
      url: `${BASE_URL}/governorates/gov-1/status`,
    });
    expect(request.request.body).toEqual({ status: 'suspended' });
    request.flush({});
  });

  it('deletes a governorate', () => {
    repository.deleteGovernorate('gov-1').subscribe();

    http.expectOne({ method: 'DELETE', url: `${BASE_URL}/governorates/gov-1` }).flush(null);
  });
});
