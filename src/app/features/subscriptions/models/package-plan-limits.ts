import { PlanLimits } from '../../../shared/models/plan-limits';

/** The admin plan also caps live stories, which the shared limits leave out. */
export interface PackagePlanLimits extends PlanLimits {
  /** null = no cap. */
  readonly activeStories: number | null;
}
