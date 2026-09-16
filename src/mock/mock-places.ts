export interface MockPlace {
  readonly id: string;
  readonly name: string;
  readonly categoryName: string;
  readonly address: string;
}

/** Stores the offers and ads mocks share. Ids follow the places mock, so links open a real place page. */
export const MOCK_PLACES: readonly MockPlace[] = [
  {
    id: 'place-1',
    name: 'ألبسة الفاخر',
    categoryName: 'ألبسة',
    address: 'دمشق، المزة، شارع الجلاء',
  },
  {
    id: 'place-7',
    name: 'ألبسة الجمال',
    categoryName: 'ألبسة',
    address: 'طرطوس،طرطوس المدينة، شارع الثورة',
  },
  {
    id: 'place-3',
    name: 'صيدلية الحياة',
    categoryName: 'صيدلية',
    address: 'طرطوس، بانياس، الكورنيش',
  },
  {
    id: 'place-4',
    name: 'مطعم الأصالة',
    categoryName: 'مطعم',
    address: 'دمشق، المزة، أوتوستراد المزة',
  },
  {
    id: 'place-5',
    name: 'مقهى الزاوية',
    categoryName: 'مقهى',
    address: 'اللاذقية، الكورنيش الجنوبي',
  },
  {
    id: 'place-6',
    name: 'نادي القوة',
    categoryName: 'نادي رياضي',
    address: 'حمص، الوعر، شارع الغوطة',
  },
];
