import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ChartPeriod, DashboardRepository } from '../data/dashboard.repository';
import { DashboardStore } from './dashboard.store';

const SUMMARY = {
  revenue: 23000,
  pendingReviewCount: 73,
  placeCount: 3000,
  newPlaceCount: 20,
  userCount: 173000,
  newUserCount: 320,
};
const REVENUE_SERIES = { name: 'الإيرادات', points: [{ label: 'Jan', value: 10 }] };
const GROWTH_SERIES = [{ name: 'الشركات', points: [{ label: 'Mon', value: 5 }] }];

function createStore(repository: Partial<DashboardRepository>) {
  TestBed.configureTestingModule({
    providers: [DashboardStore, { provide: DashboardRepository, useValue: repository }],
  });
  return TestBed.inject(DashboardStore);
}

describe('DashboardStore', () => {
  it('loads the summary, action items, recent places and both charts', () => {
    const store = createStore({
      getSummary: () => of(SUMMARY),
      getActionItems: () => of([{ id: 'a', label: 'بلاغ', count: 1, tone: 'error' }]),
      getRecentPlaces: () => of([]),
      getRevenueSeries: () => of(REVENUE_SERIES),
      getGrowthSeries: () => of(GROWTH_SERIES),
    });

    store.loadDashboard();

    expect(store.summary()).toEqual(SUMMARY);
    expect(store.actionItems().length).toBe(1);
    expect(store.revenueSeries()).toEqual(REVENUE_SERIES);
    expect(store.growthSeries()).toEqual(GROWTH_SERIES);
    expect(store.isLoading()).toBe(false);
  });

  it('starts the two charts on the periods the design marks active', () => {
    const store = createStore({});

    expect(store.revenuePeriod()).toBe('monthly');
    expect(store.growthPeriod()).toBe('weekly');
  });

  it('setRevenuePeriod reloads only the revenue series', () => {
    let revenueRequest: ChartPeriod | null = null;
    let growthRequests = 0;
    const store = createStore({
      getRevenueSeries: (period) => {
        revenueRequest = period;
        return of(REVENUE_SERIES);
      },
      getGrowthSeries: () => {
        growthRequests += 1;
        return of(GROWTH_SERIES);
      },
    });

    store.setRevenuePeriod('daily');

    expect(store.revenuePeriod()).toBe('daily');
    expect(revenueRequest).toBe('daily');
    expect(growthRequests).toBe(0);
    expect(store.revenueSeries()).toEqual(REVENUE_SERIES);
  });

  it('setGrowthPeriod reloads only the growth series', () => {
    let growthRequest: ChartPeriod | null = null;
    let revenueRequests = 0;
    const store = createStore({
      getRevenueSeries: () => {
        revenueRequests += 1;
        return of(REVENUE_SERIES);
      },
      getGrowthSeries: (period) => {
        growthRequest = period;
        return of(GROWTH_SERIES);
      },
    });

    store.setGrowthPeriod('yearly');

    expect(store.growthPeriod()).toBe('yearly');
    expect(growthRequest).toBe('yearly');
    expect(revenueRequests).toBe(0);
    expect(store.growthSeries()).toEqual(GROWTH_SERIES);
  });
});
