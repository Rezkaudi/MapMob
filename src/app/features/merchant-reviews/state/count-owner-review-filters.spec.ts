import { NO_OWNER_REVIEW_FILTERS } from '../models/owner-review-filters';
import { countOwnerReviewFilters } from './count-owner-review-filters';

describe('countOwnerReviewFilters', () => {
  it('counts nothing when every group says "الكل"', () => {
    expect(countOwnerReviewFilters(NO_OWNER_REVIEW_FILTERS)).toBe(0);
  });

  it('counts the stars, the report status and a period', () => {
    expect(
      countOwnerReviewFilters({
        ...NO_OWNER_REVIEW_FILTERS,
        rating: 4,
        reportStatus: 'pending',
        period: 'last7Days',
      }),
    ).toBe(3);
  });
});
