import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { MerchantOverviewHttpRepository } from './merchant-overview-http.repository';

const BASE = 'https://api.test/owner/overview';

function setUp() {
  TestBed.configureTestingModule({
    providers: [
      MerchantOverviewHttpRepository,
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: API_BASE_URL, useValue: 'https://api.test' },
    ],
  });
  return {
    repository: TestBed.inject(MerchantOverviewHttpRepository),
    http: TestBed.inject(HttpTestingController),
  };
}

function flushOverview(http: HttpTestingController, hasPlan: boolean): void {
  http.expectOne(`${BASE}/summary`).flush({
    data: {
      place: { id: '87', name: 'مطعم الروابي', status: 'active' },
      views: { value: 2300, periodDays: 30 },
      searchAppearances: null,
      favorites: 73,
      rating: { average: 4.7, reviewCount: 12 },
    },
  });
  http.expectOne(`${BASE}/interactions`).flush({
    status_code: 200,
    data: {
      items: [
        { id: 5, type: 'review', title: 'تقييم جديد', createdAt: '2026-10-28T09:00:00Z' },
        {
          id: 6,
          type: 'offer_expiring',
          message: 'ينتهي عرضك',
          created_at: '2026-10-27T09:00:00Z',
        },
      ],
      unreadCount: 1,
    },
  });
  http.expectOne(`${BASE}/reviews`).flush({
    status_code: 200,
    data: {
      averageRating: 4.7,
      total: 1,
      reviews: [
        {
          id: 9,
          rating: 4,
          comment: 'ممتاز',
          user: { id: 3, name: 'سارة' },
          createdAt: '2026-10-26T10:00:00Z',
        },
      ],
    },
  });
  http.expectOne(`${BASE}/subscription`).flush({
    data: {
      current: hasPlan
        ? {
            id: '12',
            plan: { id: '1', name: 'الباقة الذهبية', features: ['دعم فني'] },
            startsAt: '2026-10-29T00:00:00+00:00',
            endsAt: '2026-11-27T23:59:59+00:00',
            status: 'active',
          }
        : null,
      daysRemaining: 29,
      usagePercent: 3,
    },
  });
}

describe('MerchantOverviewHttpRepository', () => {
  it('builds the overview from the four overview calls', async () => {
    const { repository, http } = setUp();
    const response = firstValueFrom(repository.getOverview());

    flushOverview(http, true);

    expect(await response).toEqual({
      placeName: 'مطعم الروابي',
      stats: {
        viewCount: 2300,
        viewChangePercent: 0,
        searchAppearanceCount: 0,
        searchAppearanceChangePercent: 0,
        favoriteCount: 73,
        averageRating: 4.7,
        reviewCount: 12,
      },
      activities: [
        { id: '5', kind: 'review', message: 'تقييم جديد', occurredAt: '2026-10-28T09:00:00Z' },
        { id: '6', kind: 'offer', message: 'ينتهي عرضك', occurredAt: '2026-10-27T09:00:00Z' },
      ],
      latestReviews: [
        {
          id: '9',
          authorName: 'سارة',
          rating: 4,
          comment: 'ممتاز',
          createdAt: '2026-10-26T10:00:00Z',
        },
      ],
      subscription: {
        plan: { id: '1', name: 'الباقة الذهبية' },
        startsOn: '2026-10-29',
        endsOn: '2026-11-27',
        features: ['دعم فني'],
      },
    });
  });

  it('has no subscription when the place has no current plan', async () => {
    const { repository, http } = setUp();
    const response = firstValueFrom(repository.getOverview());

    flushOverview(http, false);

    expect((await response).subscription).toBeNull();
  });

  it('turns the weekly points into dated labels and the top week into the peak day', async () => {
    const { repository, http } = setUp();
    const response = firstValueFrom(repository.getPerformance('weekly'));

    const request = http.expectOne((one) => one.url === `${BASE}/performance`);
    expect(request.request.params.get('period')).toBe('weekly');
    request.flush({
      data: {
        period: 'weekly',
        points: [
          { periodStart: '2026-1', views: 3, websiteClicks: 0 },
          { periodStart: '2026-44', views: 9, websiteClicks: 1 },
        ],
        averageViews: 6,
        topDay: { periodStart: '2026-44', views: 9, websiteClicks: 1 },
      },
    });

    expect(await response).toEqual({
      points: [
        { label: '29/12', value: 3 },
        { label: '26/10', value: 9 },
      ],
      dailyAverageViewCount: 6,
      peakDay: { on: '2026-10-26', viewCount: 9 },
    });
  });

  it('has no peak day while the place has no views', async () => {
    const { repository, http } = setUp();
    const response = firstValueFrom(repository.getPerformance('yearly'));

    http
      .expectOne((one) => one.url === `${BASE}/performance`)
      .flush({
        data: {
          points: [{ periodStart: '2026', views: 0, websiteClicks: 0 }],
          averageViews: 0,
          topDay: { periodStart: '2026', views: 0, websiteClicks: 0 },
        },
      });

    expect(await response).toEqual({
      points: [{ label: '2026', value: 0 }],
      dailyAverageViewCount: 0,
      peakDay: null,
    });
  });

  it('answers an empty daily chart without a call, as the server has no daily period', async () => {
    const { repository, http } = setUp();

    const performance = await firstValueFrom(repository.getPerformance('daily'));

    http.expectNone(() => true);
    expect(performance).toEqual({ points: [], dailyAverageViewCount: 0, peakDay: null });
  });
});
