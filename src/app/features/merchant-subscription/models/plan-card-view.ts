import { PlanLimitRow } from '../../../shared/state/plan-limit-rows';
import { MerchantPlan } from './merchant-plan';
import { PlanAction } from './plan-action';

/** One card under "الباقات المتاحة", ready to draw. */
export interface PlanCardView {
  readonly plan: MerchantPlan;
  readonly eyebrow: string;
  readonly amountText: string;
  readonly currencyText: string;
  /** null for a free plan, which has no period. */
  readonly periodText: string | null;
  readonly priceNote: string;
  readonly limitRows: readonly PlanLimitRow[];
  readonly isCurrent: boolean;
  readonly action: PlanAction;
}
