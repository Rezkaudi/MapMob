import { ReviewDetail } from '../models/review-detail';

const DAY_MS = 86_400_000;
const FIRST_ROW_DAYS_AGO = 3;
const SAMPLE_REVIEW_DAYS_AGO = 14;
const SAMPLE_SUBMIT_HOUR = 20;
const SAMPLE_SUBMIT_MINUTE = 42;

function daysBefore(now: Date, dayCount: number): Date {
  return new Date(now.getTime() - dayCount * DAY_MS);
}

/** The table's first row, and the reported review the drawer frame shows. */
export function buildDesignSampleReviews(now: Date): readonly ReviewDetail[] {
  const submittedAt = daysBefore(now, SAMPLE_REVIEW_DAYS_AGO);
  submittedAt.setHours(SAMPLE_SUBMIT_HOUR, SAMPLE_SUBMIT_MINUTE, 0, 0);
  return [
    {
      review: {
        id: 'review-1',
        userName: 'أحمد جمال',
        placeName: 'صيدلية الحياة',
        rating: 5,
        comment: 'المكان ممتاز والخدمة سريعة جداً',
        createdAt: daysBefore(now, FIRST_ROW_DAYS_AGO).toISOString(),
        status: 'published',
      },
      place: {
        referenceNumber: 3187,
        name: 'صيدلية الحياة',
        categoryName: 'صيدلية',
        governorateName: 'طرطوس',
        areaName: 'بانياس',
      },
      reviewer: {
        name: 'أحمد جمال',
        memberSince: '2024-03-10T00:00:00.000Z',
        reviewCount: 6,
        isPhoneVerified: true,
      },
      report: null,
    },
    {
      review: {
        id: 'review-2',
        userName: 'سارة محمد',
        placeName: 'صيدلية الشفاء',
        rating: 2,
        comment:
          'الخدمة كانت بطيئة ولم أجد بعض الأدوية الأساسية في الصيدلية، نرجو تحسين التوفر والمتابعة من الإدارة.',
        createdAt: submittedAt.toISOString(),
        status: 'reported',
      },
      place: {
        referenceNumber: 4920,
        name: 'صيدلية الشفاء',
        categoryName: 'صيدلية',
        governorateName: 'طرطوس',
        areaName: 'طرطوس المدينة',
      },
      reviewer: {
        name: 'سارة محمد',
        memberSince: '2024-01-05T00:00:00.000Z',
        reviewCount: 14,
        isPhoneVerified: true,
      },
      report: {
        reporterName: 'إدارة صيدلية الشفاء',
        reason: 'معلومات غير صحيحة وإساءة',
        notes:
          'العميلة لم تقم بزيارة الفرع والأدوية المذكورة متوفرة دائماً ومسجلة في هيئة الغذاء والدواء، نرجو حذف هذا التقييم الكيدي.',
      },
    },
  ];
}
