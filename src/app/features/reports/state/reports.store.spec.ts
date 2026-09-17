import { TestBed } from '@angular/core/testing';
import { NEVER, Observable, of, throwError } from 'rxjs';
import { ChartPeriod } from '../../../shared/models/chart-period';
import { ChartSeries } from '../../../shared/models/chart-series';
import { ReportsRepository } from '../data/reports.repository';
import { ReportsStore } from './reports.store';

const CATEGORY_SHARES = [{ categoryName: 'مطاعم', share: 29 }];
const GOVERNORATES = [{ governorateName: 'دمشق', visitCount: 16750, share: 32 }];
const USAGE = [{ label: 'عمليات البحث والاستكشاف', count: 24150, share: 42 }];
const GROWTH: readonly ChartSeries[] = [
  { name: 'المستخدمون النشطون', points: [{ label: 'Mon', value: 34 }] },
  { name: 'المستخدمون الجدد', points: [{ label: 'Mon', value: 12 }] },
];
const REVENUE: ChartSeries = { name: 'الإيرادات', points: [{ label: 'Jul', value: 48200 }] };

function fullRepository(overrides: Partial<ReportsRepository> = {}): ReportsRepository {
  return {
    getCategoryShares: () => of(CATEGORY_SHARES),
    getGovernorateActivities: () => of(GOVERNORATES),
    getUsageMetrics: () => of(USAGE),
    getGrowthSeries: () => of(GROWTH),
    getRevenueSeries: () => of(REVENUE),
    ...overrides,
  };
}

function createStore(repository: ReportsRepository) {
  TestBed.configureTestingModule({
    providers: [ReportsStore, { provide: ReportsRepository, useValue: repository }],
  });
  return TestBed.inject(ReportsStore);
}

describe('ReportsStore', () => {
  it('starts each card on the tab the design marks active', () => {
    const store = createStore(fullRepository());

    expect(store.growth().period).toBe('weekly');
    expect(store.usage().period).toBe('weekly');
    expect(store.revenue().period).toBe('monthly');
  });

  it('loads every card at once', () => {
    const store = createStore(fullRepository());

    store.loadReports();

    expect(store.categoryShares()).toEqual(CATEGORY_SHARES);
    expect(store.governorateActivities()).toEqual(GOVERNORATES);
    expect(store.usage().data).toEqual(USAGE);
    expect(store.growth().data).toEqual(GROWTH);
    expect(store.revenue().data).toEqual(REVENUE);
    expect(store.isLoading()).toBe(false);
  });

  it('asks each chart for its starting period', () => {
    const requested: Record<string, ChartPeriod> = {};
    const store = createStore(
      fullRepository({
        getGrowthSeries: (period) => ((requested['growth'] = period), of(GROWTH)),
        getUsageMetrics: (period) => ((requested['usage'] = period), of(USAGE)),
        getRevenueSeries: (period) => ((requested['revenue'] = period), of(REVENUE)),
      }),
    );

    store.loadReports();

    expect(requested).toEqual({ growth: 'weekly', usage: 'weekly', revenue: 'monthly' });
  });

  it('shows the loading state on every card while the first load runs', () => {
    const store = createStore(fullRepository({ getCategoryShares: () => NEVER }));

    store.loadReports();

    expect(store.isLoading()).toBe(true);
    expect(store.isGrowthLoading()).toBe(true);
    expect(store.isUsageLoading()).toBe(true);
    expect(store.isRevenueLoading()).toBe(true);
  });

  it('keeps the error message when the first load fails', () => {
    const store = createStore(
      fullRepository({ getCategoryShares: () => throwError(() => new Error('تعذر التحميل')) }),
    );

    store.loadReports();

    expect(store.error()).toBe('تعذر التحميل');
    expect(store.isLoading()).toBe(false);
  });

  it('reloads only the usage card when its tab changes', () => {
    let growthRequests = 0;
    let usagePeriod: ChartPeriod | null = null;
    const store = createStore(
      fullRepository({
        getGrowthSeries: () => (growthRequests++, of(GROWTH)),
        getUsageMetrics: (period) => ((usagePeriod = period), of(USAGE)),
      }),
    );

    store.setUsagePeriod('yearly');

    expect(usagePeriod).toBe('yearly');
    expect(store.usage().period).toBe('yearly');
    expect(growthRequests).toBe(0);
  });

  it('marks a card busy while its new period loads', () => {
    const pending = new Observable<ChartSeries>(() => undefined);
    const store = createStore(fullRepository({ getRevenueSeries: () => pending }));

    store.setRevenuePeriod('daily');

    expect(store.revenue().isLoading).toBe(true);
    expect(store.isRevenueLoading()).toBe(true);
  });

  it('switches the growth card to the new period', () => {
    const store = createStore(fullRepository());

    store.setGrowthPeriod('monthly');

    expect(store.growth()).toEqual({ period: 'monthly', data: GROWTH, isLoading: false });
  });

  it('stops the spinner and keeps the message when a period reload fails', () => {
    const store = createStore(
      fullRepository({ getGrowthSeries: () => throwError(() => new Error('خطأ')) }),
    );

    store.setGrowthPeriod('yearly');

    expect(store.growth().isLoading).toBe(false);
    expect(store.error()).toBe('خطأ');
  });

  it('turns the loaded data into rows and chart options for the page', () => {
    const store = createStore(fullRepository());

    store.loadReports();

    expect(store.usageMetricRows()[0].valueText).toBe('24,150');
    expect(store.governorateActivityRows()[0].valueText).toBe('16,750 زيارة');
    expect(store.growthChart().series.length).toBe(2);
    expect(store.revenueChart().xaxis.categories).toEqual(['Jul']);
  });

  it('gathers what is on screen for the export', () => {
    const store = createStore(fullRepository());

    store.loadReports();

    expect(store.snapshot()).toEqual({
      categoryShares: CATEGORY_SHARES,
      usageMetrics: USAGE,
      governorateActivities: GOVERNORATES,
      growthSeries: GROWTH,
      revenueSeries: REVENUE,
    });
  });
});
