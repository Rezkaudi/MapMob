import { createSeededRandom, pickOne, randomInt } from '../../../../mock/random';
import { ReviewDetail } from '../models/review-detail';
import { ReviewReport } from '../models/review-report';
import { ReviewStatus } from '../models/review-status';
import { ReviewedPlace } from '../models/reviewed-place';
import { buildDesignSampleReviews } from './review-mock-samples';

const DAY_MS = 86_400_000;
const OLDEST_REVIEW_DAYS = 720;
const LONGEST_MEMBERSHIP_DAYS = 900;
const MAX_REVIEW_COUNT = 40;
const FIRST_PLACE_NUMBER = 1000;
const LAST_PLACE_NUMBER = 9999;
/** One review in 750 is reported, so 3000 reviews hold the design's four reports. */
const REPORTED_EVERY = 750;
const HIDDEN_SHARE = 0.05;
const UNRATED_SHARE = 0.04;
const LOW_RATING_SHARE = 0.15;
const VERIFIED_PHONE_SHARE = 0.7;

const USER_NAMES = [
  'أحمد جمال',
  'سارة محمد',
  'خالد إبراهيم',
  'منى عبد الله',
  'يوسف علي',
  'هدى سالم',
];
const PLACES: readonly Omit<ReviewedPlace, 'referenceNumber'>[] = [
  { name: 'صيدلية الحياة', categoryName: 'صيدلية', governorateName: 'طرطوس', areaName: 'بانياس' },
  { name: 'مطعم الأصالة', categoryName: 'مطعم', governorateName: 'دمشق', areaName: 'المزة' },
  { name: 'مقهى الزاوية', categoryName: 'مقهى', governorateName: 'اللاذقية', areaName: 'الكورنيش' },
  { name: 'سوبر ماركت النور', categoryName: 'متجر', governorateName: 'حمص', areaName: 'الوعر' },
  { name: 'عيادة الشفاء', categoryName: 'عيادة', governorateName: 'حلب', areaName: 'الفرقان' },
];
const COMMENTS = [
  'المكان ممتاز والخدمة سريعة جداً',
  'تجربة رائعة وأنصح بالتعامل معهم',
  'الخدمة جيدة لكن الانتظار كان طويلاً',
  'مكان نظيف والموظفون متعاونون',
];
const REPORT: ReviewReport = {
  reporterName: 'إدارة المكان',
  reason: 'محتوى مسيء',
  notes: 'التقييم لا يصف تجربة حقيقية ونرجو مراجعته.',
};

function pickStatus(index: number, next: () => number): ReviewStatus {
  if (index % REPORTED_EVERY === 1) {
    return 'reported';
  }
  return next() < HIDDEN_SHARE ? 'hidden' : 'published';
}

function pickRating(next: () => number): number | null {
  if (next() < UNRATED_SHARE) {
    return null;
  }
  return next() < LOW_RATING_SHARE ? randomInt(next, 1, 2) : randomInt(next, 3, 5);
}

function buildReviewDetail(index: number, now: Date): ReviewDetail {
  const next = createSeededRandom(index + 1);
  const createdAt = now.getTime() - randomInt(next, 0, OLDEST_REVIEW_DAYS * DAY_MS);
  const status = pickStatus(index, next);
  const place = pickOne(next, PLACES);
  const userName = pickOne(next, USER_NAMES);
  return {
    review: {
      id: `review-${index + 1}`,
      userName,
      placeName: place.name,
      rating: pickRating(next),
      comment: pickOne(next, COMMENTS),
      createdAt: new Date(createdAt).toISOString(),
      status,
    },
    place: { ...place, referenceNumber: randomInt(next, FIRST_PLACE_NUMBER, LAST_PLACE_NUMBER) },
    reviewer: {
      name: userName,
      memberSince: new Date(
        createdAt - randomInt(next, 0, LONGEST_MEMBERSHIP_DAYS) * DAY_MS,
      ).toISOString(),
      reviewCount: randomInt(next, 1, MAX_REVIEW_COUNT),
      isPhoneVerified: next() < VERIFIED_PHONE_SHARE,
    },
    report: status === 'reported' ? REPORT : null,
  };
}

/** Deterministic reviews placed in time relative to `now`, led by the design's two samples. */
export function buildReviewSeed(now: Date, reviewCount: number): ReviewDetail[] {
  const samples = buildDesignSampleReviews(now);
  return Array.from({ length: reviewCount }, (_, index) =>
    index < samples.length ? samples[index] : buildReviewDetail(index, now),
  );
}
