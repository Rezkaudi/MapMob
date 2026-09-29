import { formatArabicCount, pickArabicCountWord } from '../../../shared/formatting/arabic-count';
import { PlanUsage } from '../models/plan-usage';
import { UsageCardView } from '../models/usage-card-view';
import { UsageCount } from '../models/usage-count';
import { USAGE_KIND_COPY, UsageKindCopy } from './usage-kind-copy';

const FULL_PERCENT = 100;
/** The frame turns the products card amber at 80%. */
const NEAR_LIMIT_PERCENT = 80;
const CARD_ORDER: readonly (keyof PlanUsage)[] = [
  'products',
  'galleryImages',
  'activeOffers',
  'adsThisMonth',
];

function describeUncapped(copy: UsageKindCopy, used: number): UsageCardView {
  return {
    title: copy.title,
    iconName: copy.iconName,
    usedCount: used,
    limitText: '/ غير محدود',
    usedPercent: 0,
    percentText: '',
    isNearLimit: false,
    note: 'استخدام غير محدود ضمن باقتك الحالية.',
  };
}

function writeLimit(copy: UsageKindCopy, limit: number): string {
  if (!copy.limitWords) {
    return `/ ${limit} مستخدمة`;
  }
  return `/ ${limit} ${pickArabicCountWord(limit, copy.limitWords)}`;
}

function writeNote(copy: UsageKindCopy, remaining: number, isNearLimit: boolean): string {
  if (remaining === 0) {
    return 'وصلت للحد الأقصى ضمن الباقة الحالية.';
  }
  const left = formatArabicCount(remaining, copy.remainingWords);
  return isNearLimit
    ? `متبقي ${left} فقط ضمن الباقة الحالية.`
    : `متبقي ${left}${copy.roomyNoteEnding}.`;
}

function describeUsage(copy: UsageKindCopy, { used, limit }: UsageCount): UsageCardView {
  if (limit === null) {
    return describeUncapped(copy, used);
  }
  const remaining = Math.max(0, limit - used);
  const usedPercent = remaining === 0 ? FULL_PERCENT : Math.round((used / limit) * FULL_PERCENT);
  const isNearLimit = usedPercent >= NEAR_LIMIT_PERCENT;
  return {
    title: copy.title,
    iconName: copy.iconName,
    usedCount: used,
    limitText: writeLimit(copy, limit),
    usedPercent,
    percentText: `${usedPercent}%`,
    isNearLimit,
    note: writeNote(copy, remaining, isNearLimit),
  };
}

export function buildUsageCards(usage: PlanUsage): readonly UsageCardView[] {
  return CARD_ORDER.map((kind) => describeUsage(USAGE_KIND_COPY[kind], usage[kind]));
}
