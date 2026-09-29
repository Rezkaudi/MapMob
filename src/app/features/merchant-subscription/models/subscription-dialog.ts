import { MerchantPlan } from './merchant-plan';
import { SubscriptionRecord } from './subscription-record';

/** The one dialog the page has open. */
export type SubscriptionDialog =
  | { readonly kind: 'details'; readonly record: SubscriptionRecord }
  | { readonly kind: 'upgrade'; readonly plan: MerchantPlan }
  | { readonly kind: 'downgrade'; readonly plan: MerchantPlan }
  | { readonly kind: 'renewal' };
