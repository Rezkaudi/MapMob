import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { ReportsHttpRepository } from './reports-http.repository';

const REPORTS_URL = 'https://api.test/admin/reports';

describe('ReportsHttpRepository', () => {
  let repository: ReportsHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReportsHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'https://api.test' },
      ],
    });
    repository = TestBed.inject(ReportsHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('reads the category shares by name and percent', async () => {
    const response = firstValueFrom(repository.getCategoryShares());

    http
      .expectOne({ method: 'GET', url: `${REPORTS_URL}/categoryshares` })
      .flush([{ category: { id: '1', name: 'مطاعم' }, placeCount: 2, sharePercent: 40 }]);

    expect(await response).toEqual([{ categoryName: 'مطاعم', share: 40 }]);
  });

  it('reads the visits per governorate', async () => {
    const response = firstValueFrom(repository.getGovernorateActivities());

    http
      .expectOne({ method: 'GET', url: `${REPORTS_URL}/governorateactivity` })
      .flush([{ governorate: { id: '1', name: 'دمشق' }, visitCount: 12, sharePercent: 60 }]);

    expect(await response).toEqual([{ governorateName: 'دمشق', visitCount: 12, share: 60 }]);
  });

  it('puts the active users first and labels the points for the period', async () => {
    const response = firstValueFrom(repository.getGrowthSeries('yearly'));

    const request = http.expectOne((candidate) => candidate.url === `${REPORTS_URL}/user-growth`);
    expect(request.request.params.get('period')).toBe('yearly');
    request.flush([
      { key: 'newUsers', name: 'مستخدمون جدد', points: [{ periodStart: '2026-09-01', value: 9 }] },
      {
        key: 'activeUsers',
        name: 'مستخدمون نشطون',
        points: [{ periodStart: '2026-09-01', value: 20 }],
      },
    ]);

    expect(await response).toEqual([
      { name: 'مستخدمون نشطون', points: [{ label: '2026', value: 20 }] },
      { name: 'مستخدمون جدد', points: [{ label: '2026', value: 9 }] },
    ]);
  });

  it('reads the usage of a period by label, count and percent', async () => {
    const response = firstValueFrom(repository.getUsageMetrics('monthly'));

    const request = http.expectOne((candidate) => candidate.url === `${REPORTS_URL}/usage`);
    expect(request.request.params.get('period')).toBe('monthly');
    request.flush([{ key: 'search', label: 'عمليات البحث', count: 18, sharePercent: 63 }]);

    expect(await response).toEqual([{ label: 'عمليات البحث', count: 18, share: 63 }]);
  });

  it('reads the revenue of a period', async () => {
    const response = firstValueFrom(repository.getRevenueSeries('yearly'));

    const request = http.expectOne((candidate) => candidate.url === `${REPORTS_URL}/revenue`);
    expect(request.request.params.get('period')).toBe('yearly');
    request.flush({
      name: 'الإيرادات',
      currency: 'SYP',
      points: [{ periodStart: '2026-09-01', value: 1000 }],
    });

    expect(await response).toEqual({ name: 'الإيرادات', points: [{ label: '2026', value: 1000 }] });
  });
});
