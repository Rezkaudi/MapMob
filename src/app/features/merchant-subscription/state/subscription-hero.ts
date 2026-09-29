import { SPACED_SLASH, formatSlashDate } from '../../../shared/formatting/slash-date';
import { formatGroupedNumber } from '../../../shared/formatting/grouped-number';
import { CURRENCY_SYMBOLS } from '../../../shared/money/currency-symbols';
import { MerchantSubscriptionOverview } from '../models/merchant-subscription-overview';
import { SubscriptionHeroView } from '../models/subscription-hero-view';
import { PAYMENT_METHOD_IN_FULL } from './payment-method-words';
import { findUpgradeTarget } from './plan-action';
import { SUBSCRIPTION_STATUS_COPY } from './subscription-status-copy';
import { TERM_ADVERB } from './term-words';

export function buildSubscriptionHero(
  overview: MerchantSubscriptionOverview,
): SubscriptionHeroView {
  const { current } = overview;
  const upgradeTarget = findUpgradeTarget(overview);
  return {
    planName: current.plan.name,
    status: SUBSCRIPTION_STATUS_COPY[current.status],
    amountText: formatGroupedNumber(current.price.amount),
    periodText: `${CURRENCY_SYMBOLS[current.price.currency]} / ${TERM_ADVERB[current.term]}`,
    startsOnText: formatSlashDate(current.startsOn, SPACED_SLASH),
    endsOnText: formatSlashDate(current.endsOn, SPACED_SLASH),
    paymentMethodText: PAYMENT_METHOD_IN_FULL[current.paymentMethod],
    upgradeTarget,
    canUpgrade: upgradeTarget !== null && overview.pendingRequest === null,
  };
}
