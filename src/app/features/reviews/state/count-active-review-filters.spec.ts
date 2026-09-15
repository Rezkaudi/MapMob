import { NO_REVIEW_FILTERS } from '../models/review-filters';
import { countActiveReviewFilters } from './count-active-review-filters';

describe('countActiveReviewFilters', () => {
  it('counts nothing for the untouched panel', () => {
    expect(countActiveReviewFilters(NO_REVIEW_FILTERS)).toBe(0);
  });

  it('counts each group set to something other than "الكل", ignoring a blank place', () => {
    expect(
      countActiveReviewFilters({
        rating: 'fourStarsAndUp',
        status: 'reported',
        placeName: 'صيدلية الحياة',
        period: 'custom',
        customRange: { from: '2026-08-01', to: '2026-09-02' },
      }),
    ).toBe(4);
    expect(countActiveReviewFilters({ ...NO_REVIEW_FILTERS, placeName: '   ' })).toBe(0);
  });
});
