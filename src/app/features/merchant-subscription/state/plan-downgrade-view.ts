import { BillingCycle } from '../../../shared/models/billing-cycle';
import { MerchantPlan } from '../models/merchant-plan';
import { MerchantPlanLimits } from '../models/merchant-plan-limits';
import { MerchantSubscriptionOverview } from '../models/merchant-subscription-overview';
import {
  PlanLimitColumn,
  PlanLimitComparisonRow,
  PlanDowngradeView,
} from '../models/plan-downgrade-view';
import { priceForCycle } from './plan-price';

const COMPARED_LIMITS: readonly { key: keyof MerchantPlanLimits; label: string }[] = [
  { key: 'products', label: 'عدد المنتجات والخدمات:' },
  { key: 'galleryImages', label: 'عدد الصور:' },
  { key: 'activeOffers', label: 'عدد العروض:' },
  { key: 'adsPerMonth', label: 'عدد الإعلانات:' },
];

function compareLimit(label: string, limit: number | null): PlanLimitComparisonRow {
  if (limit === null) {
    return { label, value: 'غير محدود', isUnavailable: false };
  }
  if (limit === 0) {
    return { label, value: '0 (غير متاحة)', isUnavailable: true };
  }
  return { label, value: String(limit), isUnavailable: false };
}

function describeColumn(name: string, limits: MerchantPlanLimits | undefined): PlanLimitColumn {
  return {
    name,
    rows: COMPARED_LIMITS.map(({ key, label }) => compareLimit(label, limits?.[key] ?? null)),
  };
}

export function buildDowngradeView(
  overview: MerchantSubscriptionOverview,
  target: MerchantPlan,
  cycle: BillingCycle,
): PlanDowngradeView {
  const { current } = overview;
  const currentPlan = overview.plans.find((plan) => plan.id === current.plan.id);
  return {
    title: `الانتقال إلى ${target.name}`,
    description: `أنت على وشك الانتقال من باقتك الحالية إلى ${target.name}، ستتغير المزايا وحدود الاستخدام وفقاً لما هو متاح ب${target.name}`,
    current: describeColumn(current.plan.name, currentPlan?.limits),
    target: describeColumn(target.name, target.limits),
    warning: `عند الانتقال إلى ${target.name}، ستفقد المزايا والحدود الإضافية المتاحة في باقتك الحالية.`,
    confirmLabel: `تأكيد الانتقال إلى ${target.name}`,
    draft: { kind: 'downgrade', planId: target.id, term: priceForCycle(target, cycle).term },
  };
}
