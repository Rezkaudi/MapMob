import { createSeededRandom, pickOne, randomInt } from '../../../../mock/random';
import { OwnerReview } from '../models/owner-review';
import { OwnerReviewReportStatus } from '../models/owner-review-report-status';

const DAY_MS = 86_400_000;
const OLDEST_REVIEW_DAYS = 720;
/** The design's star bars: 85, 28, 9, 4 and 2 reviews for 5 down to 1 stars. */
const DESIGN_STAR_COUNTS: readonly (readonly [stars: number, count: number])[] = [
  [5, 85],
  [4, 28],
  [3, 9],
  [2, 4],
  [1, 2],
];
/** The design's "18 تقييماً جديداً" this month. */
const THIS_MONTH_COUNT = 18;
/** Sixteen the month before, so the change reads "+13%". */
const LAST_MONTH_COUNT = 16;
/** The fourth row of the design waits on a report; every ninth review after it too. */
const PENDING_EVERY = 9;
const PENDING_OFFSET = 3;
const ACCEPTED_INDEX = 40;
const REJECTED_INDEX = 41;

const AUTHOR_NAMES = [
  'أحمد جمال',
  'سارة محمد',
  'خالد إبراهيم',
  'منى عبد الله',
  'يوسف علي',
  'هدى سالم',
];
const AUTHORS = AUTHOR_NAMES.map((name, index) => ({ id: `user-${index + 1}`, name }));
const COMMENTS = [
  'الخدمة كانت ممتازة والتعامل راقي جداً، وفروا لي دواء نادر بسرعة فائقة مع تقديم نصائح وإرشادات دقيقة عن الجرعات وطريقة الاستخدام.',
  'مكان نظيف والموظفون متعاونون، والأسعار معقولة ومناسبة مقارنة بغيرهم.',
  'تجربة رائعة وأنصح بالتعامل معهم.',
  'الأسعار أغلى بكثير من باقي المتاجر المجاورة والمعاملة لم تكن جيدة عند الاستفسار.',
  'الخدمة جيدة لكن الانتظار كان طويلاً.',
];

function spreadStars(): number[] {
  return DESIGN_STAR_COUNTS.flatMap(([stars, count]) => Array<number>(count).fill(stars));
}

/** A fixed shuffle, so the table mixes the stars but looks the same on every load. */
function shuffle<T>(items: T[], next: () => number): T[] {
  for (let index = items.length - 1; index > 0; index--) {
    const other = randomInt(next, 0, index);
    [items[index], items[other]] = [items[other], items[index]];
  }
  return items;
}

function pickReportStatus(index: number): OwnerReviewReportStatus {
  if (index === ACCEPTED_INDEX) {
    return 'accepted';
  }
  if (index === REJECTED_INDEX) {
    return 'rejected';
  }
  return index % PENDING_EVERY === PENDING_OFFSET ? 'pending' : 'none';
}

function pickCreatedAt(index: number, now: Date, next: () => number): string {
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
  if (index < THIS_MONTH_COUNT) {
    return new Date(randomInt(next, monthStart, now.getTime())).toISOString();
  }
  if (index < THIS_MONTH_COUNT + LAST_MONTH_COUNT) {
    return new Date(randomInt(next, lastMonthStart, monthStart - 1)).toISOString();
  }
  return new Date(lastMonthStart - randomInt(next, 1, OLDEST_REVIEW_DAYS * DAY_MS)).toISOString();
}

export function buildOwnerReviewSeed(now: Date): OwnerReview[] {
  const stars = shuffle(spreadStars(), createSeededRandom(1));
  return stars.map((rating, index) => {
    const next = createSeededRandom(index + 1);
    return {
      id: `owner-review-${index + 1}`,
      author: pickOne(next, AUTHORS),
      rating,
      comment: pickOne(next, COMMENTS),
      createdAt: pickCreatedAt(index, now, next),
      reportStatus: pickReportStatus(index),
    };
  });
}
