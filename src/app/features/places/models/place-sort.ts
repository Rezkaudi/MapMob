export type PlaceSort = 'newest' | 'oldest' | 'rating' | 'name';

export const PLACE_SORT_LABEL: Record<PlaceSort, string> = {
  newest: 'الأحدث',
  oldest: 'الأقدم',
  rating: 'الأعلى تقييماً',
  name: 'الاسم',
};
