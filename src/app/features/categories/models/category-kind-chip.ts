import { CategoryKind } from './category-kind';

export type CategoryKindChip = 'all' | CategoryKind;

export const CATEGORY_KIND_CHIP_LABEL: Record<CategoryKindChip, string> = {
  all: 'الكل',
  main: 'التصنيفات الرئيسية',
  sub: 'التصنيفات الفرعية',
};
