import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DashboardRepository } from '../data/dashboard.repository';
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

  it('defaults the chart period to monthly', () => {
    const store = createStore({});

    expect(store.period()).toBe('monthly');
  });

  it('setPeriod reloads the charts for the new period', () => {
    let requestedPeriod: string | null = null;
    const store = createStore({
      getSummary: () => of(SUMMARY),
      getActionItems: () => of([]),
      getRecentPlaces: () => of([]),
      getRevenueSeries: (period) => {
        requestedPeriod = period;
        return of(REVENUE_SERIES);
      },
      getGrowthSeries: () => of(GROWTH_SERIES),
    });

    store.setPeriod('weekly');

    expect(store.period()).toBe('weekly');
    expect(requestedPeriod).toBe('weekly');
  });
});
