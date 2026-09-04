import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { mockResponse } from '../../../../mock/mock-delay';
import { paginate } from '../../../../mock/paginate';
import { createSeededRandom, pickOne, randomInt } from '../../../../mock/random';
import { Review } from '../models/review';
import { ReviewQuery } from '../models/review-query';
import { ReviewStatus } from '../models/review-status';
import { ReviewSummary } from '../models/review-summary';
import { ReviewRepository } from './review.repository';

const TOTAL_REVIEW_COUNT = 3000;
const REPORTED_COUNT = 4;
const NEW_COUNT = 14;
const AVERAGE_RATING = 4.3;

const USER_NAMES = [
  'أحمد جمال',
  'سارة محمود',
  'خالد إبراهيم',
  'منى عبد الله',
  'يوسف علي',
  'هدى سالم',
];
const PLACE_NAMES = [
  'صيدلية الحياة',
  'مطعم الأصالة',
  'مقهى الزاوية',
  'سوبر ماركت النور',
  'عيادة الشفاء',
];
const COMMENTS = [
  'المكان ممتاز والخدمة سريعة جداً',
  'تجربة رائعة وأنصح بالتعامل معهم',
  'الخدمة جيدة لكن الانتظار كان طويلاً',
  'مكان نظيف والموظفون متعاونون',
];
const STATUSES: readonly ReviewStatus[] = [
  'published',
  'published',
  'published',
  'reported',
  'hidden',
];

function buildReview(index: number): Review {
  const next = createSeededRandom(index + 1);
  return {
    id: `review-${index + 1}`,
    userName: pickOne(next, USER_NAMES),
    userAvatarUrl: null,
    placeName: pickOne(next, PLACE_NAMES),
    rating: randomInt(next, 30, 50) / 10,
    comment: pickOne(next, COMMENTS),
    createdAt: new Date(2024, 0, randomInt(next, 1, 28)).toISOString(),
    status: pickOne(next, STATUSES),
  };
}

const ALL_REVIEWS: readonly Review[] = Array.from({ length: TOTAL_REVIEW_COUNT }, (_, i) =>
  buildReview(i),
);

@Injectable()
export class ReviewMockRepository implements ReviewRepository {
  getReviews(query: ReviewQuery): Observable<PagedResult<Review>> {
    const filtered = ALL_REVIEWS.filter((review) => {
      const matchesStatus = !query.status || review.status === query.status;
      const matchesSearch = !query.search || review.userName.includes(query.search);
      return matchesStatus && matchesSearch;
    });
    return mockResponse(paginate(filtered, query.pageIndex, query.pageSize));
  }

  getSummary(): Observable<ReviewSummary> {
    return mockResponse({
      reportedCount: REPORTED_COUNT,
      newCount: NEW_COUNT,
      averageRating: AVERAGE_RATING,
      totalCount: TOTAL_REVIEW_COUNT,
    });
  }
}
