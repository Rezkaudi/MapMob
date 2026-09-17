import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { ReportsHttpRepository } from './reports-http.repository';

const BASE_URL = 'https://api.test';

describe('ReportsHttpRepository', () => {
  let repository: ReportsHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReportsHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    repository = TestBed.inject(ReportsHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('asks for the category shares', () => {
    repository.getCategoryShares().subscribe();

    http.expectOne({ method: 'GET', url: `${BASE_URL}/reports/category-shares` }).flush([]);
  });

  it('asks for the governorate activity', () => {
    repository.getGovernorateActivities().subscribe();

    http.expectOne({ method: 'GET', url: `${BASE_URL}/reports/governorate-activity` }).flush([]);
  });

  it('asks for the user growth of a period', () => {
    repository.getGrowthSeries('weekly').subscribe();

    const request = http.expectOne(
      (candidate) => candidate.url === `${BASE_URL}/reports/user-growth`,
    );
    expect(request.request.params.get('period')).toBe('weekly');
    request.flush([]);
  });

  it('asks for the usage metrics of a period', () => {
    repository.getUsageMetrics('monthly').subscribe();

    const request = http.expectOne((candidate) => candidate.url === `${BASE_URL}/reports/usage`);
    expect(request.request.params.get('period')).toBe('monthly');
    request.flush([]);
  });

  it('asks for the revenue of a period', () => {
    repository.getRevenueSeries('daily').subscribe();

    const request = http.expectOne((candidate) => candidate.url === `${BASE_URL}/reports/revenue`);
    expect(request.request.params.get('period')).toBe('daily');
    request.flush({ name: '', points: [] });
  });
});
