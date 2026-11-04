import { CurrencyCode } from '../../../shared/money/currency-code';
import { PackagePlanLimits } from './package-plan-limits';

/** What the edit dialog can change about a package. */
export interface PlanDraft {
  readonly name: string;
  readonly isActive: boolean;
  readonly monthlyPrice: number;
  readonly yearlyPrice: number | null;
  readonly currency: CurrencyCode;
  readonly limits: PackagePlanLimits;
  readonly features: readonly string[];
}
