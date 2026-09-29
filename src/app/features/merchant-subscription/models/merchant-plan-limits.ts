import { PlanLimits } from '../../../shared/models/plan-limits';

/** The merchant screens also count products, which the admin plan cards leave out. */
export interface MerchantPlanLimits extends PlanLimits {
  /** null = no cap. */
  readonly products: number | null;
}
