import { CountWords, formatArabicCount } from '../../../shared/formatting/arabic-count';
import { PlanQuota } from '../../../shared/models/plan-quota';
import { QuotaNouns } from '../../../shared/models/quota-nouns';
import { describePlanQuota } from '../../../shared/state/plan-quota';
import { MerchantStoryLibrary } from '../models/merchant-story-library';

const UNCAPPED_NOTICE = 'باقتك الحالية لا تحدّ عدد القصص النشطة.';
const UNCAPPED_LIMIT = 'بلا حد';

const STORY_WORDS: CountWords = { one: 'قصة واحدة', two: 'قصتان', few: 'قصص', many: 'قصة' };

const STORY_QUOTA_NOUNS: QuotaNouns = {
  limitWords: {
    one: 'قصة مستخدمة',
    two: 'قصتين مستخدمتين',
    few: 'قصص مستخدمة',
    many: 'قصة مستخدمة',
  },
  remainingWords: STORY_WORDS,
  uncappedNotice: UNCAPPED_NOTICE,
};

/** Only stories still showing take room in the plan; expired ones do not. */
export function countActiveStories(library: MerchantStoryLibrary): number {
  return library.items.filter((story) => story.status === 'active').length;
}

export function describeStoryQuota(library: MerchantStoryLibrary): PlanQuota {
  return describePlanQuota(
    countActiveStories(library),
    library.activeStoryLimit,
    STORY_QUOTA_NOUNS,
  );
}

/** "الحد المسموح 5 قصص", under the count tiles. */
export function describeStoryLimit(library: MerchantStoryLibrary): string {
  const limit = library.activeStoryLimit;
  return `الحد المسموح ${limit === null ? UNCAPPED_LIMIT : formatArabicCount(limit, STORY_WORDS)}`;
}

/** The grey line at the top of the add dialog. */
export function describeStoryDialogNotice(library: MerchantStoryLibrary): string {
  const limit = library.activeStoryLimit;
  if (limit === null) {
    return UNCAPPED_NOTICE;
  }
  const remaining = formatArabicCount(
    Math.max(0, limit - countActiveStories(library)),
    STORY_WORDS,
  );
  const allowed = formatArabicCount(limit, STORY_WORDS);
  return `متبقي لديك ${remaining} ضمن ${library.plan.name} (الحد المسموح ${allowed})`;
}
