import { MOCK_PLACES } from '../../../../mock/mock-places';
import { createSeededRandom, pickOne, randomInt } from '../../../../mock/random';
import { addCalendarDays, toCalendarDay } from '../../../shared/formatting/calendar-day';
import { ComplaintDetail } from '../models/complaint-detail';
import { ComplaintReason } from '../models/complaint-reason';
import { ComplaintReporter } from '../models/complaint-reporter';
import { ComplaintStatus } from '../models/complaint-status';
import { ReportedPlace } from '../models/reported-place';

const SEED = 20260917;
const FIRST_REFERENCE_NUMBER = 1023;
const LONGEST_DAY_GAP = 60;
const LOWEST_RATING_TENTHS = 30;
const HIGHEST_RATING_TENTHS = 50;
const TENTHS = 10;
const FEWEST_REVIEWS = 8;
const MOST_REVIEWS = 240;
const RESTAURANT_IMAGE = 'assets/images/place-restaurant-hall.jpg';
const STOREFRONT_IMAGE = 'assets/images/complaint-closed-storefront.jpg';

/** The design's rows run new, in review, rejected, resolved. */
const STATUS_CYCLE: readonly ComplaintStatus[] = ['new', 'inReview', 'rejected', 'resolved'];
const REASON_CYCLE: readonly ComplaintReason[] = [
  'wrongInformation',
  'closedPlace',
  'inappropriateContent',
  'fakeReview',
  'other',
];

/** Ids follow the users mock, so "عرض الملف الشخصي للمستخدم" opens a real profile. */
const REPORTERS: readonly ComplaintReporter[] = [
  { id: 'user-1', name: 'سارة علي', email: 'sara.r@example.com', phone: '+966 54 123 4567' },
  {
    id: 'user-2',
    name: 'أحمد محمد المصطفى',
    email: 'ahmad.m@example.com',
    phone: '+963 944 123 456',
  },
  { id: 'user-3', name: 'خالد يوسف', email: 'khaled.y@example.com', phone: '+963 933 765 210' },
  { id: 'user-4', name: 'ليلى حسن', email: 'layla.h@example.com', phone: '+963 955 402 118' },
];

/** The design's place leads; the rest are the stores the other mocks share. */
const SHAM_RESTAURANT: Omit<ReportedPlace, 'rating' | 'reviewCount'> = {
  id: 'place-4',
  name: 'مطعم الشام',
  categoryName: 'مطاعم',
  address: 'طرطوس،طرطوس المدينة',
  imageUrl: RESTAURANT_IMAGE,
};
const PLACES: readonly Omit<ReportedPlace, 'rating' | 'reviewCount'>[] = [
  SHAM_RESTAURANT,
  ...MOCK_PLACES.map((place) => ({
    id: place.id,
    name: place.name,
    categoryName: place.categoryName,
    address: place.address,
    imageUrl: null,
  })),
];

const DESCRIPTIONS: Record<ComplaintReason, string> = {
  wrongInformation: 'معلومات المكان غير صحيحة',
  closedPlace: 'المكان مغلق بشكل دائم',
  inappropriateContent: 'صور أو نصوص غير لائقة في صفحة المكان',
  fakeReview: 'تقييمات مكررة من حسابات وهمية',
  other: 'مشكلة أخرى في صفحة المكان',
};

const USER_DETAILS = [
  'ذهبت إلى الموقع مرتين متتاليتين خلال ساعات العمل المعتادة ولم أجد المطعم مفتوحاً',
  'رقم الهاتف المكتوب لا يعمل، والعنوان يشير إلى شارع آخر.',
  'لاحظت عدة تقييمات بنفس النص خلال يوم واحد.',
];

function buildPlace(index: number, next: () => number): ReportedPlace {
  return {
    ...PLACES[index % PLACES.length],
    rating: randomInt(next, LOWEST_RATING_TENTHS, HIGHEST_RATING_TENTHS) / TENTHS,
    reviewCount: randomInt(next, FEWEST_REVIEWS, MOST_REVIEWS),
  };
}

/** A fixed list, so the mock pages look the same on every reload. */
export function buildComplaintSeed(today: Date, count: number): readonly ComplaintDetail[] {
  const next = createSeededRandom(SEED);
  const lastDay = toCalendarDay(today);
  return Array.from({ length: count }, (_, index) => {
    const reason = REASON_CYCLE[index % REASON_CYCLE.length];
    return {
      id: `complaint-${index + 1}`,
      reference: `#${FIRST_REFERENCE_NUMBER + index}`,
      reason,
      status: STATUS_CYCLE[index % STATUS_CYCLE.length],
      reportedOn: addCalendarDays(lastDay, -randomInt(next, 0, LONGEST_DAY_GAP)),
      reporter: REPORTERS[index % REPORTERS.length],
      place: buildPlace(index, next),
      description: DESCRIPTIONS[reason],
      userDetails: pickOne(next, USER_DETAILS),
      attachmentUrls: index % 2 === 0 ? [STOREFRONT_IMAGE] : [],
      adminNotes: '',
    };
  });
}
