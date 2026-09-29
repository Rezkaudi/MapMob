import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  type,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { tap } from 'rxjs';
import { BillingCycle } from '../../../shared/models/billing-cycle';
import { withSaveStatus } from '../../../shared/state/with-save-status';
import { MerchantSubscriptionRepository } from '../data/merchant-subscription.repository';
import { MerchantSubscriptionOverview } from '../models/merchant-subscription-overview';
import { PlanCardView } from '../models/plan-card-view';
import { PlanChangeRequest } from '../models/plan-change-request';
import { SubscriptionDialog } from '../models/subscription-dialog';
import { SubscriptionRecord } from '../models/subscription-record';
import { findUpgradeTarget } from './plan-action';
import { buildDowngradeView } from './plan-downgrade-view';
import { buildRenewalRequest, buildUpgradeRequest } from './plan-request-view';
import { buildSubscriptionDetails } from './subscription-details';

/** What the dialogs need from the overview feature they sit on. */
type OverviewState = { overview: MerchantSubscriptionOverview | null; cycle: BillingCycle };
type OverviewEditing = { markRequestPending(request: PlanChangeRequest): void };

interface SubscriptionDialogState {
  readonly dialog: SubscriptionDialog | null;
  /** Shows the "تم إرسال الطلب" toast. */
  readonly isRequestSent: boolean;
}

/** The details dialog and the three plan-change dialogs, each sent as one request. */
export function withSubscriptionDialogs() {
  return signalStoreFeature(
    { state: type<OverviewState>(), methods: type<OverviewEditing>() },
    withState<SubscriptionDialogState>({ dialog: null, isRequestSent: false }),
    withSaveStatus(),
    withComputed(({ dialog, overview, cycle }) => ({
      detailsView: computed(() => {
        const open = dialog();
        const loaded = overview();
        return open?.kind === 'details' && loaded
          ? buildSubscriptionDetails(open.record, loaded.plans)
          : null;
      }),
      requestView: computed(() => {
        const open = dialog();
        const loaded = overview();
        if (!loaded) {
          return null;
        }
        if (open?.kind === 'upgrade') {
          return buildUpgradeRequest(loaded, open.plan, cycle());
        }
        return open?.kind === 'renewal' ? buildRenewalRequest(loaded) : null;
      }),
      downgradeView: computed(() => {
        const open = dialog();
        const loaded = overview();
        return open?.kind === 'downgrade' && loaded
          ? buildDowngradeView(loaded, open.plan, cycle())
          : null;
      }),
    })),
    withComputed(({ requestView, downgradeView }) => ({
      openDraft: computed(() => requestView()?.draft ?? downgradeView()?.draft ?? null),
    })),
    withMethods((store, repository = inject(MerchantSubscriptionRepository)) => {
      const open = (dialog: SubscriptionDialog) => patchState(store, { dialog });
      return {
        openDetails(record: SubscriptionRecord): void {
          open({ kind: 'details', record });
        },
        openCurrentDetails(): void {
          const loaded = store.overview();
          if (loaded) {
            open({ kind: 'details', record: loaded.current });
          }
        },
        openHeroUpgrade(): void {
          const loaded = store.overview();
          const plan = loaded ? findUpgradeTarget(loaded) : null;
          if (plan && !loaded?.pendingRequest) {
            open({ kind: 'upgrade', plan });
          }
        },
        openPlanAction({ plan, action }: PlanCardView): void {
          if (action.isDisabled) {
            return;
          }
          if (action.kind === 'upgrade' || action.kind === 'downgrade') {
            open({ kind: action.kind, plan });
          } else if (action.kind === 'renewal') {
            open({ kind: 'renewal' });
          }
        },
        closeDialog(): void {
          patchState(store, { dialog: null });
          store.clearSaveError();
        },
        dismissRequestSent(): void {
          patchState(store, { isRequestSent: false });
        },
        async submitRequest(): Promise<void> {
          const draft = store.openDraft();
          if (!draft) {
            return;
          }
          const send = repository
            .requestPlanChange(draft)
            .pipe(tap((request) => store.markRequestPending(request)));
          if (await store.runSave(send)) {
            patchState(store, { dialog: null, isRequestSent: true });
          }
        },
      };
    }),
  );
}
