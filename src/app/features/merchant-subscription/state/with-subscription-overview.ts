import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { CLOCK } from '../../../core/config/clock';
import { toCalendarDay } from '../../../shared/formatting/calendar-day';
import { BillingCycle } from '../../../shared/models/billing-cycle';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { MerchantSubscriptionOverview } from '../models/merchant-subscription-overview';
import { PlanChangeRequest } from '../models/plan-change-request';
import { buildHistoryRows } from './history-rows';
import { buildPlanCards } from './plan-cards';
import { buildSubscriptionHero } from './subscription-hero';
import { buildUsageCards } from './usage-cards';

interface SubscriptionOverviewState {
  readonly overview: MerchantSubscriptionOverview | null;
  readonly cycle: BillingCycle;
}

const initialState: SubscriptionOverviewState = { overview: null, cycle: 'monthly' };

/** The loaded page and the four sections drawn from it. */
export function withSubscriptionOverview() {
  return signalStoreFeature(
    withState(initialState),
    withRequestStatus(),
    withProps(() => ({ today: toCalendarDay(inject(CLOCK)()) })),
    withComputed(({ overview, cycle, today }) => ({
      hero: computed(() => {
        const loaded = overview();
        return loaded ? buildSubscriptionHero(loaded) : null;
      }),
      usageCards: computed(() => {
        const loaded = overview();
        return loaded ? buildUsageCards(loaded.usage) : [];
      }),
      planCards: computed(() => {
        const loaded = overview();
        return loaded ? buildPlanCards(loaded, cycle(), today) : [];
      }),
      historyRows: computed(() => buildHistoryRows(overview()?.history ?? [])),
    })),
    withMethods((store) => ({
      selectCycle(cycle: BillingCycle): void {
        patchState(store, { cycle });
      },
      markRequestPending(pendingRequest: PlanChangeRequest): void {
        const loaded = store.overview();
        if (loaded) {
          patchState(store, { overview: { ...loaded, pendingRequest } });
        }
      },
    })),
  );
}
