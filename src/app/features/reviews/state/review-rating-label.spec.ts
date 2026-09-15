import { formatReviewRating } from './review-rating-label';

describe('formatReviewRating', () => {
  it('writes whole stars with one decimal, as the table and drawer do', () => {
    expect(formatReviewRating(5)).toBe('5.0');
    expect(formatReviewRating(2)).toBe('2.0');
  });

  it('gives nothing for a review left without stars', () => {
    expect(formatReviewRating(null)).toBeNull();
  });
});
