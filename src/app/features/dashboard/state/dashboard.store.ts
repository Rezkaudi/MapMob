import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of, forkJoin } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { ActionItem } from '../models/action-item';
import { ChartSeries } from '../models/chart-point';
import { DashboardSummary } from '../models/dashboard-summary';
import { RecentPlace } from '../models/recent-place';
import { ChartPeriod, DashboardRepository } from '../data/dashboard.repository';

interface DashboardState {
  readonly summary: DashboardSummary | null;
  readonly actionItems: readonly ActionItem[];
  readonly recentPlaces: readonly RecentPlace[];
  readonly revenueSeries: ChartSeries | null;
  readonly growthSeries: readonly ChartSeries[];
  readonly revenuePeriod: ChartPeriod;
  readonly growthPeriod: ChartPeriod;
  readonly isRevenueLoading: boolean;
  readonly isGrowthLoading: boolean;
}

/** The design marks شهري active on the revenue chart and اسبوعي on the growth chart. */
const initialState: DashboardState = {
  summary: null,
  actionItems: [],
  recentPlaces: [],
  revenueSeries: null,
  growthSeries: [],
  revenuePeriod: 'monthly',
  growthPeriod: 'weekly',
  isRevenueLoading: false,
  isGrowthLoading: false,
};

export const DashboardStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withRequestStatus(),
  withComputed(({ isLoading, isRevenueLoading, isGrowthLoading }) => ({
    isRevenueChartLoading: computed(() => isLoading() || isRevenueLoading()),
    isGrowthChartLoading: computed(() => isLoading() || isGrowthLoading()),
  })),
  withMethods((store, repository = inject(DashboardRepository)) => ({
    loadDashboard: rxMethod<void>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(() =>
          forkJoin({
            summary: repository.getSummary(),
            actionItems: repository.getActionItems(),
            recentPlaces: repository.getRecentPlaces(),
            revenueSeries: repository.getRevenueSeries(store.revenuePeriod()),
            growthSeries: repository.getGrowthSeries(store.growthPeriod()),
          }).pipe(
            tap((result) => {
              patchState(store, result);
              store.setLoaded();
            }),
            catchError((error: Error) => {
              store.setError(error.message);
              return of(null);
            }),
          ),
        ),
      ),
    ),

    setRevenuePeriod: rxMethod<ChartPeriod>(
      pipe(
        tap((revenuePeriod) => patchState(store, { revenuePeriod, isRevenueLoading: true })),
        switchMap((period) =>
          repository.getRevenueSeries(period).pipe(
            tap((revenueSeries) => patchState(store, { revenueSeries, isRevenueLoading: false })),
            catchError((error: Error) => {
              patchState(store, { isRevenueLoading: false });
              store.setError(error.message);
              return of(null);
            }),
          ),
        ),
      ),
    ),

    setGrowthPeriod: rxMethod<ChartPeriod>(
      pipe(
        tap((growthPeriod) => patchState(store, { growthPeriod, isGrowthLoading: true })),
        switchMap((period) =>
          repository.getGrowthSeries(period).pipe(
            tap((growthSeries) => patchState(store, { growthSeries, isGrowthLoading: false })),
            catchError((error: Error) => {
              patchState(store, { isGrowthLoading: false });
              store.setError(error.message);
              return of(null);
            }),
          ),
        ),
      ),
    ),
  })),
);
