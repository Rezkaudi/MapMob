import { NamedReference } from '../models/named-reference';
import { LiveOwnerQuotaSummary } from './live-owner-quota-summary';

/** Shown in place of a plan name while the place has none; its limits are then 0. */
export const NO_PLAN: NamedReference = { id: '', name: 'بدون باقة' };

export function ownerPlanOf(summary: LiveOwnerQuotaSummary): NamedReference {
  return summary.plan ? { id: summary.plan.id, name: summary.plan.name } : NO_PLAN;
}
