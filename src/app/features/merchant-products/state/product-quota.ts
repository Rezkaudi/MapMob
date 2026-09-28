import { CountWords, formatArabicCount } from '../../../shared/formatting/arabic-count';
import { ProductQuota } from '../models/product-quota';

const FULL_PERCENT = 100;
const LIMIT_WORDS: CountWords = { one: 'منتج', two: 'منتجين', few: 'منتجات', many: 'منتجاً' };
/** "متبقي لك …" needs the subject form: منتجان, not منتجين. */
const REMAINING_WORDS: CountWords = {
  one: 'منتج واحد',
  two: 'منتجان',
  few: 'منتجات',
  many: 'منتجاً',
};
const FULL_CHIP_TEXT = 'وصلت للحد المتاح';
const FULL_NOTICE = 'وصلت للحد المتاح في باقتك الحالية. رقِّ باقتك لإضافة المزيد.';

const UNCAPPED_QUOTA = {
  limitText: '/ بلا حد',
  usedPercent: 0,
  isFull: false,
  remainingChipText: 'عدد غير محدود',
  remainingChipTone: 'success',
  notice: 'باقتك الحالية لا تحدّ عدد المنتجات والخدمات.',
} as const;

/** `limit` null is a plan with no cap. */
export function describeProductQuota(usedCount: number, limit: number | null): ProductQuota {
  if (limit === null) {
    return { usedCount, ...UNCAPPED_QUOTA };
  }
  const remainingCount = Math.max(0, limit - usedCount);
  const isFull = remainingCount === 0;
  const usedPercent = isFull ? FULL_PERCENT : Math.round((usedCount / limit) * FULL_PERCENT);
  const remainingText = `متبقي لك ${formatArabicCount(remainingCount, REMAINING_WORDS)}`;
  return {
    usedCount,
    limitText: `/ ${formatArabicCount(limit, LIMIT_WORDS)}`,
    usedPercent,
    isFull,
    remainingChipText: isFull ? FULL_CHIP_TEXT : remainingText,
    remainingChipTone: isFull ? 'error' : 'success',
    notice: isFull ? FULL_NOTICE : `${remainingText} ضمن باقتك الحالية قبل الوصول للحد المتاح.`,
  };
}
