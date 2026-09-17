import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, forkJoin, of, pipe, switchMap, tap } from 'rxjs';
import { ChartSeries } from '../../../shared/models/chart-series';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { ReportsRepository } from '../data/reports.repository';
import { CategoryShare } from '../models/category-share';
import { GovernorateActivity } from '../models/governorate-activity';
import { PeriodChartState } from '../models/period-chart-state';
import { ReportSnapshot } from '../models/report-snapshot';
import { UsageMetric } from '../models/usage-metric';
import { toGovernorateActivityRows } from './governorate-activity-rows';
import { buildGrowthChartOptions } from './growth-chart-options';
import { reloadPeriodChart } from './reload-period-chart';
import { buildRevenueChartOptions } from './revenue-chart-options';
import { toUsageMetricRows } from './usage-metric-rows';

interface ReportsState {
  readonly categoryShares: readonly CategoryShare[];
  readonly governorateActivities: readonly GovernorateActivity[];
  readonly growth: PeriodChartState<readonly ChartSeries[]>;
  readonly usage: PeriodChartState<readonly UsageMetric[]>;
  readonly revenue: PeriodChartState<ChartSeries | null>;
}

/** The design marks اسبوعي active on growth and usage, and شهري on revenue. */
const initialState: ReportsState = {
  categoryShares: [],
  governorateActivities: [],
  growth: { period: 'weekly', data: [], isLoading: false },
  usage: { period: 'weekly', data: [], isLoading: false },
  revenue: { period: 'monthly', data: null, isLoading: false },
};

export const ReportsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withRequestStatus(),
  withComputed((store) => ({
    isGrowthLoading: computed(() => store.isLoading() || store.growth().isLoading),
    isUsageLoading: computed(() => store.isLoading() || store.usage().isLoading),
    isRevenueLoading: computed(() => store.isLoading() || store.revenue().isLoading),
    categoryShareValues: computed(() => store.categoryShares().map((category) => category.share)),
    usageMetricRows: computed(() => toUsageMetricRows(store.usage().data)),
    governorateActivityRows: computed(() =>
      toGovernorateActivityRows(store.governorateActivities()),
    ),
    growthChart: computed(() => buildGrowthChartOptions(store.growth().data)),
    revenueChart: computed(() => buildRevenueChartOptions(store.revenue().data)),
    snapshot: computed<ReportSnapshot>(() => ({
      categoryShares: store.categoryShares(),
      usageMetrics: store.usage().data,
      governorateActivities: store.governorateActivities(),
      growthSeries: store.growth().data,
      revenueSeries: store.revenue().data,
    })),
  })),
  withMethods((store, repository = inject(ReportsRepository)) => ({
    loadReports: rxMethod<void>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(() =>
          forkJoin({
            categoryShares: repository.getCategoryShares(),
            governorateActivities: repository.getGovernorateActivities(),
            growthData: repository.getGrowthSeries(store.growth().period),
            usageData: repository.getUsageMetrics(store.usage().period),
            revenueData: repository.getRevenueSeries(store.revenue().period),
          }).pipe(
            tap(({ categoryShares, governorateActivities, growthData, usageData, revenueData }) => {
              patchState(store, {
                categoryShares,
                governorateActivities,
                growth: { ...store.growth(), data: growthData },
                usage: { ...store.usage(), data: usageData },
                revenue: { ...store.revenue(), data: revenueData },
              });
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

    setGrowthPeriod: reloadPeriodChart({
      readChart: store.growth,
      writeChart: (growth) => patchState(store, { growth }),
      load: (period) => repository.getGrowthSeries(period),
      reportError: store.setError,
    }),

    setUsagePeriod: reloadPeriodChart({
      readChart: store.usage,
      writeChart: (usage) => patchState(store, { usage }),
      load: (period) => repository.getUsageMetrics(period),
      reportError: store.setError,
    }),

    setRevenuePeriod: reloadPeriodChart<ChartSeries | null>({
      readChart: store.revenue,
      writeChart: (revenue) => patchState(store, { revenue }),
      load: (period) => repository.getRevenueSeries(period),
      reportError: store.setError,
    }),
  })),
);
