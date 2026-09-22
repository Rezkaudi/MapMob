import { Category } from '../models/category';

export function buildCategory(overrides: Partial<Category> = {}): Category {
  return {
    id: 'category-1',
    name: 'مطاعم',
    kind: 'main',
    parentId: null,
    parentName: null,
    icon: 'utensils-crossed',
    color: '#0583EC',
    placeCount: 50,
    status: 'active',
    updatedAt: '2024-01-12T00:00:00.000Z',
    ...overrides,
  };
}
