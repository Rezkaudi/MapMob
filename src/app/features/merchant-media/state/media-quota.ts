import { CountWords, formatArabicCount } from '../../../shared/formatting/arabic-count';
import { PlanQuota } from '../../../shared/models/plan-quota';
import { QuotaNouns } from '../../../shared/models/quota-nouns';
import { describePlanQuota } from '../../../shared/state/plan-quota';
import { MerchantMediaLibrary } from '../models/merchant-media-library';

const UNCAPPED_NOTICE = 'باقتك الحالية لا تحدّ عدد الصور والفيديوهات.';
const UNCAPPED_LIMIT = 'بلا حد';

const MEDIA_WORDS: CountWords = { one: 'وسيط واحد', two: 'وسيطان', few: 'وسائط', many: 'وسيطاً' };

const MEDIA_QUOTA_NOUNS: QuotaNouns = {
  limitWords: {
    one: 'وسيط مستخدم',
    two: 'وسيطين مستخدمين',
    few: 'وسائط مستخدمة',
    many: 'وسيطاً مستخدماً',
  },
  remainingWords: MEDIA_WORDS,
  uncappedNotice: UNCAPPED_NOTICE,
};

/** The page shows one limit: pictures and videos added up. null when either has no cap. */
export function totalMediaLimit(library: MerchantMediaLibrary): number | null {
  if (library.imageLimit === null || library.videoLimit === null) {
    return null;
  }
  return library.imageLimit + library.videoLimit;
}

export function describeMediaQuota(library: MerchantMediaLibrary): PlanQuota {
  return describePlanQuota(library.items.length, totalMediaLimit(library), MEDIA_QUOTA_NOUNS);
}

/** "الحد المسموح 5 وسائط", under the count tiles. */
export function describeMediaLimit(library: MerchantMediaLibrary): string {
  const limit = totalMediaLimit(library);
  return `الحد المسموح ${limit === null ? UNCAPPED_LIMIT : formatArabicCount(limit, MEDIA_WORDS)}`;
}

/** The grey line at the top of the add dialog. */
export function describeMediaDialogNotice(library: MerchantMediaLibrary): string {
  const limit = totalMediaLimit(library);
  if (limit === null) {
    return UNCAPPED_NOTICE;
  }
  const remaining = formatArabicCount(Math.max(0, limit - library.items.length), MEDIA_WORDS);
  const allowed = formatArabicCount(limit, MEDIA_WORDS);
  return `متبقي لديك ${remaining} ضمن ${library.plan.name} (الحد المسموح ${allowed})`;
}
