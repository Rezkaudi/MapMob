import { ChoiceOption } from '../../../shared/ui/choice-chips/choice-option';
import { PLAN_TIER_LABEL } from './plan-tier-label';
import { SUBSCRIPTION_STATUS_LABEL } from './subscription-status-label';

const ALL_LABEL = 'الكل';

/** The filter popover lists the tiers most expensive first, as the design draws them. */
export const PLAN_TIER_CHOICES: readonly ChoiceOption[] = [
  { value: null, label: ALL_LABEL },
  { value: 'featured', label: PLAN_TIER_LABEL.featured },
  { value: 'basic', label: PLAN_TIER_LABEL.basic },
  { value: 'free', label: PLAN_TIER_LABEL.free },
];

export const SUBSCRIPTION_STATUS_CHOICES: readonly ChoiceOption[] = [
  { value: null, label: ALL_LABEL },
  { value: 'active', label: SUBSCRIPTION_STATUS_LABEL.active },
  { value: 'paused', label: SUBSCRIPTION_STATUS_LABEL.paused },
  { value: 'expired', label: SUBSCRIPTION_STATUS_LABEL.expired },
];
