import { PlanLimits } from './plan-limits';

/** What the edit dialog can change about a package. */
export interface PlanDraft {
  readonly name: string;
  readonly isActive: boolean;
  readonly monthlyPrice: number;
  readonly yearlyPrice: number | null;
  readonly currency: string;
  readonly limits: PlanLimits;
  readonly features: readonly string[];
}
