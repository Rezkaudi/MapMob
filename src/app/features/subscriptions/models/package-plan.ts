import { PlanLimits } from './plan-limits';
import { PlanTier } from './plan-tier';

/** One subscription package, as the cards on the "باقات الاشتراك" tab show it. */
export interface PackagePlan {
  readonly id: string;
  readonly name: string;
  readonly tier: PlanTier;
  readonly tagline: string;
  /** The pill beside the name: "VIP", "الأكثر مبيعاً", "نشطة". */
  readonly badge: string | null;
  readonly monthlyPrice: number;
  /** The yearly price after the discount, or `null` when the tier has no yearly plan. */
  readonly yearlyPrice: number | null;
  readonly currency: string;
  readonly subscriberCount: number;
  readonly limits: PlanLimits;
  readonly features: readonly string[];
  readonly isActive: boolean;
}
