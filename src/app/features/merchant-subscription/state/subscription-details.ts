import { SPACED_SLASH, formatSlashDate } from '../../../shared/formatting/slash-date';
import { formatMoney } from '../../../shared/money/format-money';
import { MerchantPlan } from '../models/merchant-plan';
import { SubscriptionDetailsView } from '../models/subscription-details-view';
import { SubscriptionRecord } from '../models/subscription-record';
import { PAYMENT_METHOD_SHORT } from './payment-method-words';
import { SUBSCRIPTION_STATUS_COPY } from './subscription-status-copy';
import { TERM_LABEL } from './term-words';

export function buildSubscriptionDetails(
  record: SubscriptionRecord,
  plans: readonly MerchantPlan[],
): SubscriptionDetailsView {
  const plan = plans.find((candidate) => candidate.id === record.plan.id);
  return {
    planName: record.plan.name,
    status: SUBSCRIPTION_STATUS_COPY[record.status],
    startsOnText: formatSlashDate(record.startsOn, SPACED_SLASH),
    endsOnText: formatSlashDate(record.endsOn, SPACED_SLASH),
    amountText: formatMoney(record.price.amount, record.price.currency),
    termLabel: TERM_LABEL[record.term],
    paymentMethodText: PAYMENT_METHOD_SHORT[record.paymentMethod],
    features: plan?.features ?? [],
  };
}
