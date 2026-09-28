import type { Category } from '../../../categories/models/category';
import type { CategoryPage } from '../../../categories/models/category-page';
import type { MainCategory } from '../../../categories/models/main-category';

export const CATEGORY_ROW = {
  id: '1',
  name: 'مطاعم',
  kind: 'main',
  parentId: null,
  parentName: null,
  icon: 'utensils-crossed',
  color: '#FF8104',
  placeCount: 34,
  status: 'active',
  updatedAt: '2026-09-22T19:01:50Z',
} satisfies Category;

export const SUB_CATEGORY_ROW = {
  id: '9',
  name: 'وجبات سريعة',
  kind: 'sub',
  parentId: '1',
  parentName: 'مطاعم',
  icon: 'sandwich',
  color: '#FC0303',
  placeCount: 12,
  status: 'active',
  updatedAt: '2026-09-23T08:40:12Z',
} satisfies Category;

export const CATEGORY_PAGE = {
  items: [CATEGORY_ROW, SUB_CATEGORY_ROW],
  totalCount: 61,
  kindCounts: { all: 61, main: 12, sub: 49 },
} satisfies CategoryPage;

export const MAIN_CATEGORIES = [
  { id: '1', name: 'مطاعم' },
  { id: '2', name: 'مواد غذائية' },
] satisfies MainCategory[];

export const CATEGORY_DRAFT = {
  name: 'وجبات سريعة',
  parentId: '1',
  icon: 'sandwich',
  color: '#FC0303',
};
