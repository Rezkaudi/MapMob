import { formatArabicCount } from '../formatting/arabic-count';
import { PlanQuota } from '../models/plan-quota';
import { QuotaNouns } from '../models/quota-nouns';

const FULL_PERCENT = 100;
const FULL_CHIP_TEXT = 'وصلت للحد المتاح';
const FULL_NOTICE = 'وصلت للحد المتاح في باقتك الحالية. رقِّ باقتك لإضافة المزيد.';

const UNCAPPED_QUOTA = {
  limitText: '/ بلا حد',
  usedPercent: 0,
  isFull: false,
  remainingChipText: 'عدد غير محدود',
  remainingChipTone: 'success',
} as const;

/** `limit` null is a plan with no cap. */
export function describePlanQuota(
  usedCount: number,
  limit: number | null,
  nouns: QuotaNouns,
): PlanQuota {
  if (limit === null) {
    return { usedCount, ...UNCAPPED_QUOTA, notice: nouns.uncappedNotice };
  }
  const remainingCount = Math.max(0, limit - usedCount);
  const isFull = remainingCount === 0;
  const usedPercent = isFull ? FULL_PERCENT : Math.round((usedCount / limit) * FULL_PERCENT);
  const remainingText = `متبقي لك ${formatArabicCount(remainingCount, nouns.remainingWords)}`;
  return {
    usedCount,
    limitText: `/ ${formatArabicCount(limit, nouns.limitWords)}`,
    usedPercent,
    isFull,
    remainingChipText: isFull ? FULL_CHIP_TEXT : remainingText,
    remainingChipTone: isFull ? 'error' : 'success',
    notice: isFull ? FULL_NOTICE : `${remainingText} ضمن باقتك الحالية قبل الوصول للحد المتاح.`,
  };
}
