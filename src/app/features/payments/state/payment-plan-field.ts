import { PaymentKind } from '../models/payment-kind';
import { PaymentMerchant } from '../models/payment-merchant';
import { PaymentPlan } from '../models/payment-plan';

/**
 * The "الباقة" row of the dialog. Only a new subscription picks its plan; an upgrade steps up
 * from the plan the merchant holds and a renewal keeps it, both read only, as the frames draw them.
 */
export interface PaymentPlanField {
  readonly label: string;
  readonly isRequired: boolean;
  readonly isSelectable: boolean;
  readonly planId: string | null;
  readonly planName: string;
}

const UPGRADE_LABEL = 'الباقة الجديدة';
const PLAN_LABEL = 'الباقة';

export function buildPaymentPlanField(
  kind: PaymentKind,
  merchant: PaymentMerchant | null,
  plans: readonly PaymentPlan[],
  pickedPlanId: string | null,
): PaymentPlanField {
  if (kind === 'new') {
    const planId = pickedPlanId ?? plans[0]?.id ?? null;
    return { label: PLAN_LABEL, isRequired: true, isSelectable: true, ...namePlan(plans, planId) };
  }
  const currentId = merchant?.currentPlanId ?? null;
  const planId = kind === 'upgrade' ? nextPlanUp(plans, currentId) : currentId;
  return {
    label: kind === 'upgrade' ? UPGRADE_LABEL : PLAN_LABEL,
    isRequired: false,
    isSelectable: false,
    ...namePlan(plans, planId),
  };
}

function nextPlanUp(plans: readonly PaymentPlan[], currentId: string | null): string | null {
  const currentIndex = plans.findIndex((plan) => plan.id === currentId);
  if (currentIndex < 0) {
    return currentId;
  }
  return plans[Math.min(currentIndex + 1, plans.length - 1)].id;
}

function namePlan(
  plans: readonly PaymentPlan[],
  planId: string | null,
): { planId: string | null; planName: string } {
  return { planId, planName: plans.find((plan) => plan.id === planId)?.name ?? '' };
}
