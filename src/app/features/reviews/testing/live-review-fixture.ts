import { LiveReview } from '../data/live-review';
import { LiveReviewedStore, LiveReviewer } from '../data/live-review-people';

export const LIVE_REVIEW: LiveReview = {
  id: 7,
  store_id: 18,
  user_id: 16,
  rating: 3,
  comment: 'جيد',
  status: 'pending',
  created_at: '2026-10-13T06:51:29.000000Z',
  user: { id: 16, name: 'خولة' },
  store: { id: 18, name: { ar: 'صيدلية الأمل', en: 'alamal pharmacy' } },
  reports: [],
};

export const LIVE_REVIEWER: LiveReviewer = {
  name: 'خولة',
  email_verified_at: '2026-10-04T19:19:31.000000Z',
  created_at: '2026-10-04T19:19:01.000000Z',
};

export const LIVE_REVIEWED_STORE: LiveReviewedStore = {
  mainCategory: { name: 'صيدلية' },
  location: { governorate: { name: 'دمشق' }, area: { name: 'المزة' } },
};
