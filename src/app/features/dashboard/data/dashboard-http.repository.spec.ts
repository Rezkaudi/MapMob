import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { DashboardHttpRepository } from './dashboard-http.repository';

const BASE_URL = 'https://api.test';
const DASHBOARD_URL = `${BASE_URL}/admin/dashboard`;

describe('DashboardHttpRepository', () => {
  let repository: DashboardHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DashboardHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    repository = TestBed.inject(DashboardHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('reads the summary and keeps the revenue amount', async () => {
    const response = firstValueFrom(repository.getSummary());

    http.expectOne(`${DASHBOARD_URL}/summary`).flush({
      data: {
        revenue: { amount: 1500, currency: 'SYP' },
        pendingPlaceCount: 2,
        placeCount: 4,
        newPlaceCount: 3,
        userCount: 11,
        newUserCount: 1,
      },
    });

    expect(await response).toEqual({
      revenue: 1500,
      pendingPlaceCount: 2,
      placeCount: 4,
      newPlaceCount: 3,
      userCount: 11,
      newUserCount: 1,
    });
  });

  it('reads the action items as they come', async () => {
    const items = [{ id: 'places-pending', label: 'أماكن', count: 1, tone: 'warning' }];
    const response = firstValueFrom(repository.getActionItems());

    http.expectOne(`${DASHBOARD_URL}/action-items`).flush({ data: items });

    expect(await response).toEqual(items);
  });

  it('turns the recent places into table rows', async () => {
    const response = firstValueFrom(repository.getRecentPlaces());

    http.expectOne(`${DASHBOARD_URL}/recent-places`).flush({
      data: [
        {
          id: '19',
          name: 'tartus store',
          logoUrl: 'https://api.test/logo.jpg',
          category: { id: '9', name: 'متجر' },
          governorate: { id: '1', name: 'دمشق' },
          rating: 4.5,
          status: 'active',
          createdAt: '2026-10-08T09:49:45+00:00',
        },
      ],
    });

    expect(await response).toEqual([
      {
        id: '19',
        name: 'tartus store',
        category: 'متجر',
        city: 'دمشق',
        rating: 4.5,
        status: 'active',
        joinedAt: '2026-10-08T09:49:45+00:00',
        logoUrl: 'https://api.test/logo.jpg',
      },
    ]);
  });

  it('reads the revenue series for a period with readable labels', async () => {
    const response = firstValueFrom(repository.getRevenueSeries('monthly'));

    const request = http.expectOne((candidate) => candidate.url === `${DASHBOARD_URL}/revenue`);
    expect(request.request.params.get('period')).toBe('monthly');
    request.flush({
      data: {
        name: 'الإيرادات',
        currency: 'SYP',
        points: [{ periodStart: '2026-09-01', value: 7 }],
      },
    });

    expect(await response).toEqual({ name: 'الإيرادات', points: [{ label: 'سبتمبر', value: 7 }] });
  });

  it('reads the growth series with places first, as the chart draws them', async () => {
    const response = firstValueFrom(repository.getGrowthSeries('yearly'));

    const request = http.expectOne((candidate) => candidate.url === `${DASHBOARD_URL}/growth`);
    expect(request.request.params.get('period')).toBe('yearly');
    request.flush({
      data: [
        { key: 'users', name: 'المستخدمون', points: [{ periodStart: '2026-01-01', value: 9 }] },
        { key: 'places', name: 'الأماكن', points: [{ periodStart: '2026-01-01', value: 3 }] },
      ],
    });

    expect(await response).toEqual([
      { name: 'الأماكن', points: [{ label: '2026', value: 3 }] },
      { name: 'المستخدمون', points: [{ label: '2026', value: 9 }] },
    ]);
  });
});
