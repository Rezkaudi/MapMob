export type ReviewRatingFilter =
  'fiveStars' | 'fourStarsAndUp' | 'threeStars' | 'twoStars' | 'oneStar' | 'unrated';

/** Keys in the order the design lays them out after "الكل", right to left then down. */
export const REVIEW_RATING_FILTER_LABEL: Record<ReviewRatingFilter, string> = {
  fiveStars: '5+ نجوم',
  fourStarsAndUp: '4+ نجوم',
  threeStars: '3 نجوم',
  twoStars: 'نجمتين',
  oneStar: 'نجمة',
  unrated: 'بدون',
};
