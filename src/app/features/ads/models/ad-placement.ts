/** The page of the app the ad shows on. */
export type AdPlacement = 'home' | 'searchResults' | 'categories' | 'placeDetails';

export const AD_PLACEMENT_LABEL: Record<AdPlacement, string> = {
  home: 'الصفحة الرئيسية',
  searchResults: 'نتائج البحث',
  categories: 'صفحة التصنيفات',
  placeDetails: 'صفحة تفاصيل المكان',
};
