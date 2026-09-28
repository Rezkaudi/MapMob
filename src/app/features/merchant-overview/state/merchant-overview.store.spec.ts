import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { ChartPeriod } from '../../../shared/models/chart-period';
import { MerchantOverviewRepository } from '../data/merchant-overview.repository';
import { MerchantOverview } from '../models/merchant-overview';
import { StorePerformance } from '../models/store-performance';
import { MerchantOverviewStore } from './merchant-overview.store';

const OVERVIEW: MerchantOverview = {
  placeName: 'مطعم الروابي',
  stats: {
    viewCount: 2300,
    viewChangePercent: 14,
    searchAppearanceCount: 200,
    searchAppearanceChangePercent: 8,
    favoriteCount: 73,
    averageRating: 4.7,
    reviewCount: 1000,
  },
  activities: [],
  latestReviews: [
    {
      id: 'r-1',
      authorName: 'سارة أحمد',
      rating: 4,
      comment: 'ممتاز',
      createdAt: '2026-07-24T10:00:00Z',
    },
  ],
  subscription: {
    plan: { id: 'plan-featured', name: 'الباقة المميزة' },
    startsOn: '2026-01-01',
    endsOn: '2026-12-31',
    features: ['ظهور متقدم في نتائج البحث'],
  },
};

const PERFORMANCE: StorePerformance = {
  points: [{ label: 'Jul', value: 400 }],
  dailyAverageViewCount: 42,
  peakDay: { on: '2026-07-23', viewCount: 142 },
};

function createStore(repository: Partial<MerchantOverviewRepository>) {
  TestBed.configureTestingModule({
    providers: [
      { provide: MerchantOverviewRepository, useValue: repository },
      { provide: CLOCK, useValue: () => new Date('2026-07-26T12:00:00Z') },
    ],
  });
  return TestBed.inject(MerchantOverviewStore);
}

describe('MerchantOverviewStore', () => {
  it('opens on the monthly tab, as the design marks شهري', () => {
    const store = createStore({});

    expect(store.performancePeriod()).toBe('monthly');
  });

  it('loads the overview and the chart together', () => {
    const periods: ChartPeriod[] = [];
    const store = createStore({
      getOverview: () => of(OVERVIEW),
      getPerformance: (period) => {
        periods.push(period);
        return of(PERFORMANCE);
      },
    });

    store.loadOverview();

    expect(store.overview()).toEqual(OVERVIEW);
    expect(store.performance()).toEqual(PERFORMANCE);
    expect(periods).toEqual(['monthly']);
    expect(store.isLoading()).toBe(false);
  });

  it('greets the store by name, as the design writes it', () => {
    const store = createStore({
      getOverview: () => of(OVERVIEW),
      getPerformance: () => of(PERFORMANCE),
    });

    store.loadOverview();

    expect(store.greeting()).toBe('مرحباً مطعم الروابي،إليك ملخص أداء متجرك و آخر التحديثات.');
  });

  it('derives the cards, the package progress and the chart footer', () => {
    const store = createStore({
      getOverview: () => of(OVERVIEW),
      getPerformance: () => of(PERFORMANCE),
    });

    store.loadOverview();

    expect(store.statCards().length).toBe(4);
    expect(store.subscriptionProgress()?.remainingText).toBe('متبقي 158 يوماً');
    expect(store.dailyAverageText()).toBe('42 مشاهدة / يوم');
    expect(store.peakDayText()).toBe('الخميس 23 يوليو (142 مشاهدة)');
  });

  it('dates each review relative to now', () => {
    const store = createStore({
      getOverview: () => of(OVERVIEW),
      getPerformance: () => of(PERFORMANCE),
    });

    store.loadOverview();

    expect(store.reviewItems()[0].ageText).toBe('منذ يومين');
  });

  it('reloads only the chart when another tab is picked', () => {
    const periods: ChartPeriod[] = [];
    const store = createStore({
      getOverview: () => of(OVERVIEW),
      getPerformance: (period) => {
        periods.push(period);
        return of(PERFORMANCE);
      },
    });
    store.loadOverview();

    store.setPerformancePeriod('weekly');

    expect(store.performancePeriod()).toBe('weekly');
    expect(periods).toEqual(['monthly', 'weekly']);
    expect(store.isPerformanceLoading()).toBe(false);
  });

  it('reports a failed load', () => {
    const store = createStore({
      getOverview: () => throwError(() => new Error('تعذر التحميل')),
      getPerformance: () => of(PERFORMANCE),
    });

    store.loadOverview();

    expect(store.error()).toBe('تعذر التحميل');
  });

  it('has no greeting before the store name arrives', () => {
    const store = createStore({});

    expect(store.greeting()).toBeNull();
  });

  it('pairs each activity with the colours of its kind', () => {
    const store = createStore({
      getOverview: () =>
        of({
          ...OVERVIEW,
          activities: [
            { id: 'a-1', kind: 'offer', message: 'عرض', occurredAt: '2026-07-26T09:00:00Z' },
          ],
        }),
      getPerformance: () => of(PERFORMANCE),
    });

    store.loadOverview();

    expect(store.activityRows()[0].skin.icon).toBe('tag-feather');
    expect(store.activityRows()[0].message).toBe('عرض');
  });
});
