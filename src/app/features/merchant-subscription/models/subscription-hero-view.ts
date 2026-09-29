import { MerchantPlan } from './merchant-plan';
import { StatusCopy } from './status-copy';

/** The "باقتك الحالية" card at the top of the page. */
export interface SubscriptionHeroView {
  readonly planName: string;
  readonly status: StatusCopy;
  readonly amountText: string;
  readonly periodText: string;
  readonly startsOnText: string;
  readonly endsOnText: string;
  readonly paymentMethodText: string;
  /** null on the top tier, which hides "ترقية الباقة". */
  readonly upgradeTarget: MerchantPlan | null;
  readonly canUpgrade: boolean;
}
