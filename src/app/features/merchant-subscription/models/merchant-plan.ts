import { CurrencyCode } from '../../../shared/money/currency-code';
import { PlanTier } from '../../../shared/models/plan-tier';
import { MerchantPlanLimits } from './merchant-plan-limits';

/** One card under "الباقات المتاحة". */
export interface MerchantPlan {
  readonly id: string;
  readonly name: string;
  readonly tier: PlanTier;
  readonly tagline: string;
  readonly monthlyPrice: number;
  /** null when the tier has no yearly price. */
  readonly yearlyPrice: number | null;
  readonly currency: CurrencyCode;
  readonly limits: MerchantPlanLimits;
  readonly features: readonly string[];
}
