import { LivePlan } from '../../../shared/data/live-plan';
import { toIsoDay } from '../../../shared/formatting/iso-day';
import { PaymentMethod } from '../../../shared/models/payment-method';
import { toCurrencyCode } from '../../../shared/money/to-currency-code';
import { NewPaymentDraft } from '../models/new-payment-draft';
import { Payment } from '../models/payment';
import { PaymentDetail, PaymentSubscription } from '../models/payment-detail';
import { PaymentFormOptions } from '../models/payment-form-options';
import { PaymentMerchant } from '../models/payment-merchant';
import { LivePayment } from './live-payment';
import { LivePaymentStore } from './live-payment-store';
import { LivePaymentSubscription } from './live-payment-subscription';

const YEAR_DAY_COUNT = 365;
const MONTHLY_CYCLE = 'شهري';
const YEARLY_CYCLE = 'سنوي';
const ACTIVE_SUBSCRIPTION = 'active';
// The dialog records cash taken in person, so the payment is paid already.
const CASH_METHOD = 'cash';
const PAID_STATUS = 'paid';

interface StoreChoice {
  readonly id: string;
  readonly name: string;
}

// The panel knows cash and "other"; bank transfer and PayTabs count as other.
function toPaymentMethod(liveMethod: string): PaymentMethod {
  return liveMethod === CASH_METHOD ? 'cash' : 'other';
}

export function toPayment(row: LivePayment): Payment {
  return {
    id: String(row.id),
    transactionNumber: `#PAY-${row.id}`,
    receiptNumber: row.receipt_number ?? '',
    companyName: row.store.name,
    amount: Number(row.amount),
    currency: toCurrencyCode(row.currency_code),
    paymentMethod: toPaymentMethod(row.payment_method),
    paidAt: toIsoDay(row.paid_at ?? row.created_at),
    notes: row.notes ?? '',
  };
}

function toPaymentSubscription(subscription: LivePaymentSubscription): PaymentSubscription {
  return {
    planName: subscription.plan.name,
    cycle: subscription.plan.duration_days >= YEAR_DAY_COUNT ? YEARLY_CYCLE : MONTHLY_CYCLE,
    startsOn: toIsoDay(subscription.starts_at),
    endsOn: toIsoDay(subscription.ends_at),
  };
}

export function toPaymentDetail(
  row: LivePayment,
  store: LivePaymentStore | null,
  subscription: LivePaymentSubscription | null,
): PaymentDetail {
  return {
    ...toPayment(row),
    company: {
      name: row.store.name,
      type: store?.mainCategory?.name ?? '',
      contactName: store?.owner?.name ?? '',
      contactPhone: store?.contact?.phone ?? '',
    },
    subscription: subscription ? toPaymentSubscription(subscription) : null,
  };
}

function toMerchant(
  store: StoreChoice,
  subscriptions: readonly LivePaymentSubscription[],
): PaymentMerchant {
  const running = subscriptions.find(
    (subscription) =>
      String(subscription.store.id) === store.id && subscription.status === ACTIVE_SUBSCRIPTION,
  );
  return {
    id: store.id,
    name: store.name,
    currentPlanId: running ? String(running.plan.id) : null,
    currentPlanName: running?.plan.name ?? null,
    subscriptionEndsOn: running ? toIsoDay(running.ends_at) : null,
    currency: toCurrencyCode(running?.plan.currency_code ?? null),
  };
}

/** The server's form options list only methods and statuses, so the choices come from three lists. */
export function toPaymentFormOptions(
  stores: readonly StoreChoice[],
  subscriptions: readonly LivePaymentSubscription[],
  plans: readonly LivePlan[],
): PaymentFormOptions {
  return {
    merchants: stores.map((store) => toMerchant(store, subscriptions)),
    plans: plans.map((plan) => ({
      id: String(plan.id),
      name: plan.name,
      monthlyPrice: plan.price,
      yearlyPrice: null,
    })),
  };
}

/** Every kind of payment starts a subscription over the picked days; the server has no renewal. */
export function toLiveSubscriptionBody(draft: NewPaymentDraft): Record<string, unknown> {
  return {
    store_id: draft.merchantId,
    plan_id: draft.planId,
    starts_at: `${draft.startsOn} 00:00:00`,
    ends_at: `${draft.endsOn} 23:59:59`,
    status: ACTIVE_SUBSCRIPTION,
    auto_renew: false,
  };
}

export function toLivePaymentBody(
  draft: NewPaymentDraft,
  subscriptionId: number,
): Record<string, unknown> {
  return {
    store_id: draft.merchantId,
    subscription_id: subscriptionId,
    amount: draft.amount,
    currency_code: draft.currency,
    paid_at: draft.paidAt,
    payment_method: CASH_METHOD,
    status: PAID_STATUS,
    notes: draft.notes,
  };
}
