import { PlanChangeKind } from './plan-change-kind';

export type PlanActionKind = PlanChangeKind | 'current' | 'pending';

/** The button at the foot of a plan card. */
export interface PlanAction {
  readonly kind: PlanActionKind;
  readonly label: string;
  readonly isDisabled: boolean;
}
