/** The picker reads right to left: utensils first, gift last. */
export const CATEGORY_ICONS = [
  'utensils',
  'coffee',
  'library',
  'dumbbell',
  'cart',
  'pill',
  'store',
  'shirt',
  'scissors',
  'gift',
] as const;

export type CategoryIcon = (typeof CATEGORY_ICONS)[number];

export function categoryIconAssetName(icon: CategoryIcon): string {
  return `category-${icon}`;
}

/** Spoken names for the picker buttons, which show only the glyph. */
export const CATEGORY_ICON_LABEL: Record<CategoryIcon, string> = {
  utensils: 'مطاعم',
  coffee: 'مقاهي',
  library: 'مكتبات',
  dumbbell: 'رياضة',
  cart: 'تسوق',
  pill: 'صيدليات',
  store: 'متاجر',
  shirt: 'ملابس',
  scissors: 'حلاقة وتجميل',
  gift: 'هدايا',
};
