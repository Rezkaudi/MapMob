import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
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
  readonly period: ChartPeriod;
}

const initialState: DashboardState = {
  summary: null,
  actionItems: [],
  recentPlaces: [],
  revenueSeries: null,
  growthSeries: [],
  period: 'monthly',
};

export const DashboardStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withRequestStatus(),
  withMethods((store, repository = inject(DashboardRepository)) => ({
    loadDashboard: rxMethod<void>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(() =>
          forkJoin({
            summary: repository.getSummary(),
            actionItems: repository.getActionItems(),
            recentPlaces: repository.getRecentPlaces(),
            revenueSeries: repository.getRevenueSeries(store.period()),
            growthSeries: repository.getGrowthSeries(store.period()),
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
  })),
  withMethods((store) => ({
    setPeriod(period: ChartPeriod): void {
      patchState(store, { period });
      store.loadDashboard();
    },
  })),
);
