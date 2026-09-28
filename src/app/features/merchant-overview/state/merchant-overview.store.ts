import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, forkJoin, of, pipe, switchMap, tap } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { formatArabicRelativeTime } from '../../../shared/formatting/arabic-relative-time';
import { toCalendarDay } from '../../../shared/formatting/calendar-day';
import { ChartPeriod } from '../../../shared/models/chart-period';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { MerchantOverviewRepository } from '../data/merchant-overview.repository';
import { MerchantActivityRow } from '../models/merchant-activity-row';
import { MerchantOverview } from '../models/merchant-overview';
import { MerchantReviewItem } from '../models/merchant-review-item';
import { StorePerformance } from '../models/store-performance';
import { MERCHANT_ACTIVITY_SKINS } from './merchant-activity-skins';
import { buildMerchantStatCards } from './merchant-stat-cards';
import { describeDailyAverage, describePeakDay } from './performance-highlights';
import { buildStorePerformanceChartOptions } from './store-performance-chart-options';
import { describeSubscriptionProgress } from './subscription-progress';

interface MerchantOverviewState {
  readonly overview: MerchantOverview | null;
  readonly performance: StorePerformance | null;
  readonly performancePeriod: ChartPeriod;
  readonly isPerformanceLoading: boolean;
}

/** The design marks شهري as the open tab. */
const initialState: MerchantOverviewState = {
  overview: null,
  performance: null,
  performancePeriod: 'monthly',
  isPerformanceLoading: false,
};

export const MerchantOverviewStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withRequestStatus(),
  withComputed(
    ({ overview, performance, isLoading, isPerformanceLoading }, clock = inject(CLOCK)) => ({
      greeting: computed(() => {
        const placeName = overview()?.placeName;
        return placeName ? `مرحباً ${placeName}،إليك ملخص أداء متجرك و آخر التحديثات.` : null;
      }),
      statCards: computed(() => {
        const stats = overview()?.stats;
        return stats ? buildMerchantStatCards(stats) : [];
      }),
      activityRows: computed((): readonly MerchantActivityRow[] =>
        (overview()?.activities ?? []).map((activity) => ({
          ...activity,
          skin: MERCHANT_ACTIVITY_SKINS[activity.kind],
        })),
      ),
      reviewItems: computed((): readonly MerchantReviewItem[] =>
        (overview()?.latestReviews ?? []).map((review) => ({
          ...review,
          ageText: formatArabicRelativeTime(review.createdAt, clock()),
        })),
      ),
      subscription: computed(() => overview()?.subscription ?? null),
      subscriptionProgress: computed(() => {
        const subscription = overview()?.subscription;
        return subscription
          ? describeSubscriptionProgress(subscription, toCalendarDay(clock()))
          : null;
      }),
      chartOptions: computed(() => buildStorePerformanceChartOptions(performance())),
      dailyAverageText: computed(() =>
        describeDailyAverage(performance()?.dailyAverageViewCount ?? 0),
      ),
      peakDayText: computed(() => describePeakDay(performance()?.peakDay ?? null)),
      isChartLoading: computed(() => isLoading() || isPerformanceLoading()),
    }),
  ),
  withMethods((store, repository = inject(MerchantOverviewRepository)) => ({
    loadOverview: rxMethod<void>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(() =>
          forkJoin({
            overview: repository.getOverview(),
            performance: repository.getPerformance(store.performancePeriod()),
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
    setPerformancePeriod: rxMethod<ChartPeriod>(
      pipe(
        tap((performancePeriod) =>
          patchState(store, { performancePeriod, isPerformanceLoading: true }),
        ),
        switchMap((period) =>
          repository.getPerformance(period).pipe(
            tap((performance) => patchState(store, { performance, isPerformanceLoading: false })),
            catchError((error: Error) => {
              patchState(store, { isPerformanceLoading: false });
              store.setError(error.message);
              return of(null);
            }),
          ),
        ),
      ),
    ),
  })),
);
