import { PlanQuota } from '../../../shared/models/plan-quota';
import { QuotaNouns } from '../../../shared/models/quota-nouns';
import { describePlanQuota } from '../../../shared/state/plan-quota';

const PRODUCT_QUOTA_NOUNS: QuotaNouns = {
  limitWords: { one: 'منتج', two: 'منتجين', few: 'منتجات', many: 'منتجاً' },
  remainingWords: { one: 'منتج واحد', two: 'منتجان', few: 'منتجات', many: 'منتجاً' },
  uncappedNotice: 'باقتك الحالية لا تحدّ عدد المنتجات والخدمات.',
};

/** `limit` null is a plan with no cap. */
export function describeProductQuota(usedCount: number, limit: number | null): PlanQuota {
  return describePlanQuota(usedCount, limit, PRODUCT_QUOTA_NOUNS);
}
