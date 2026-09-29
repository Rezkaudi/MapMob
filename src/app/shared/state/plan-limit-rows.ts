import { PlanLimits } from '../models/plan-limits';

/** Arabic switches the counted noun again above ten. */
const LAST_PLURAL_COUNT = 10;
const UNLIMITED_LABEL = 'غير محدود ⚡';

/** One "label: value" line inside the card's grey limits box. */
export interface PlanLimitRow {
  readonly label: string;
  readonly value: string;
}

function formatAds(count: number): string {
  if (count === 1) {
    return '1 إعلان شهرياً';
  }
  if (count === 2) {
    return '2 إعلانين شهرياً';
  }
  return `${count} ${count <= LAST_PLURAL_COUNT ? 'إعلانات' : 'إعلاناً'} شهرياً`;
}

function formatOffers(count: number): string {
  if (count === 1) {
    return '1 عرض نشط';
  }
  return count <= LAST_PLURAL_COUNT ? `${count} عروض نشطة` : `${count} عرضاً نشطاً`;
}

function formatImages(count: number): string {
  if (count === 1) {
    return 'صورة واحدة';
  }
  return count <= LAST_PLURAL_COUNT ? `حتى ${count} صور` : `${count} صورة`;
}

function format(limit: number | null, words: (count: number) => string): string {
  return limit === null ? UNLIMITED_LABEL : words(limit);
}

export function buildPlanLimitRows(limits: PlanLimits): readonly PlanLimitRow[] {
  return [
    { label: 'عدد الإعلانات:', value: format(limits.adsPerMonth, formatAds) },
    { label: 'عدد العروض:', value: format(limits.activeOffers, formatOffers) },
    { label: 'معرض الصور:', value: format(limits.galleryImages, formatImages) },
  ];
}
