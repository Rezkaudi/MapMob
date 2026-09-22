import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { toCalendarDay } from '../../../shared/formatting/calendar-day';
import { PaymentRepository } from '../data/payment.repository';
import { PaymentCurrency } from '../models/payment-currency';
import { PaymentFormOptions } from '../models/payment-form-options';
import { PaymentKind } from '../models/payment-kind';
import { PaymentTerm } from '../models/payment-term';
import { buildPaymentPlanField } from './payment-plan-field';
import { buildSubscriptionWindow } from './subscription-window';

/** The card the upgrade and renewal frames show above the plan field. */
export interface CurrentSubscription {
  readonly planName: string;
  readonly endsOn: string;
}

interface NewPaymentState {
  readonly isOpen: boolean;
  readonly options: PaymentFormOptions;
  readonly merchantId: string | null;
  readonly kind: PaymentKind;
  readonly pickedPlanId: string | null;
  readonly term: PaymentTerm;
  /** `null` while the amount still follows the plan's price. */
  readonly typedAmount: number | null;
  readonly paidAt: string;
  readonly notes: string;
  readonly isSaving: boolean;
  readonly saveError: string | null;
}

const EMPTY_OPTIONS: PaymentFormOptions = { merchants: [], plans: [] };

const initialState: NewPaymentState = {
  isOpen: false,
  options: EMPTY_OPTIONS,
  merchantId: null,
  kind: 'new',
  pickedPlanId: null,
  term: 'monthly',
  typedAmount: null,
  paidAt: '',
  notes: '',
  isSaving: false,
  saveError: null,
};

/** Everything the "إضافة دفعة جديدة" dialog holds while the admin fills it in. */
export const NewPaymentStore = signalStore(
  withState(initialState),
  withComputed((store) => {
    const merchant = computed(
      () => store.options().merchants.find((one) => one.id === store.merchantId()) ?? null,
    );
    const planField = computed(() =>
      buildPaymentPlanField(store.kind(), merchant(), store.options().plans, store.pickedPlanId()),
    );
    const plan = computed(
      () => store.options().plans.find((one) => one.id === planField().planId) ?? null,
    );
    const amount = computed(() => store.typedAmount() ?? listPrice(plan(), store.term()));
    return {
      merchant,
      planField,
      amount,
      merchants: computed(() => store.options().merchants),
      plans: computed(() => store.options().plans),
      currency: computed<PaymentCurrency>(() => merchant()?.currency ?? 'SYP'),
      window: computed(() => buildSubscriptionWindow(store.paidAt(), store.term())),
      currentSubscription: computed<CurrentSubscription | null>(() => {
        const running = merchant();
        if (store.kind() === 'new' || !running?.currentPlanName || !running.subscriptionEndsOn) {
          return null;
        }
        return { planName: running.currentPlanName, endsOn: running.subscriptionEndsOn };
      }),
      canSubmit: computed(
        () => !store.isSaving() && store.merchantId() !== null && planField().planId !== null,
      ),
    };
  }),
  withMethods((store, repository = inject(PaymentRepository), clock = inject(CLOCK)) => ({
    setMerchantId(merchantId: string): void {
      patchState(store, { merchantId, typedAmount: null });
    },
    setKind(kind: PaymentKind): void {
      patchState(store, { kind, typedAmount: null });
    },
    setPlanId(pickedPlanId: string): void {
      patchState(store, { pickedPlanId, typedAmount: null });
    },
    setTerm(term: PaymentTerm): void {
      patchState(store, { term, typedAmount: null });
    },
    setAmount(typedAmount: number): void {
      patchState(store, { typedAmount });
    },
    setPaidAt(paidAt: string): void {
      patchState(store, { paidAt });
    },
    setNotes(notes: string): void {
      patchState(store, { notes });
    },
    clearSaveError(): void {
      patchState(store, { saveError: null });
    },
    close(): void {
      patchState(store, initialState);
    },
    /** The card opens at once and fills its merchant and plan lists as they arrive. */
    async open(): Promise<void> {
      patchState(store, { ...initialState, isOpen: true, paidAt: toCalendarDay(clock()) });
      const options = await firstValueFrom(repository.getPaymentFormOptions());
      patchState(store, { options, merchantId: options.merchants[0]?.id ?? null });
    },
    async submit(): Promise<void> {
      const planId = store.planField().planId;
      const merchantId = store.merchantId();
      if (!planId || !merchantId || store.isSaving()) {
        return;
      }
      patchState(store, { isSaving: true, saveError: null });
      const { startsOn, endsOn } = store.window();
      try {
        await firstValueFrom(
          repository.createPayment({
            merchantId,
            kind: store.kind(),
            planId,
            term: store.term(),
            amount: store.amount(),
            currency: store.currency(),
            paidAt: store.paidAt(),
            startsOn,
            endsOn,
            notes: store.notes(),
          }),
        );
        patchState(store, initialState);
      } catch (error) {
        patchState(store, { isSaving: false, saveError: (error as Error).message });
      }
    },
  })),
);

function listPrice(plan: { monthlyPrice: number; yearlyPrice: number | null } | null, term: PaymentTerm): number {
  if (!plan) {
    return 0;
  }
  return term === 'yearly' ? (plan.yearlyPrice ?? plan.monthlyPrice) : plan.monthlyPrice;
}
