import { Category } from '../models/category';
import { CategoryDraft } from '../models/category-draft';
import { CategoryStatus } from '../models/category-status';
import { MainCategory } from '../models/main-category';

const NEW_CATEGORY_PLACE_COUNT = 0;
const MISSING_PARENT_MESSAGE = 'اختر التصنيف الرئيسي التابع له';

/** In-memory store behind the mock repository, so sub categories follow their parent. */
export class CategoryMockDatabase {
  private categories: Category[];

  constructor(seed: readonly Category[]) {
    this.categories = [...seed];
  }

  list(): Category[] {
    return this.categories;
  }

  listMain(): MainCategory[] {
    return this.categories
      .filter((category) => category.kind === 'main')
      .map(({ id, name }) => ({ id, name }));
  }

  add(draft: CategoryDraft): Category {
    const category: Category = {
      id: `category-${crypto.randomUUID()}`,
      ...this.placeUnderParent(draft),
      placeCount: NEW_CATEGORY_PLACE_COUNT,
      status: 'active',
      updatedAt: now(),
    };
    this.categories = [category, ...this.categories];
    return category;
  }

  update(id: string, draft: CategoryDraft): Category {
    const updated: Category = {
      ...this.findOrThrow(id),
      ...this.placeUnderParent(draft),
      updatedAt: now(),
    };
    this.replace(updated);
    this.renameParentOfSubCategories(updated);
    return updated;
  }

  setStatus(id: string, status: CategoryStatus): Category {
    const updated: Category = { ...this.findOrThrow(id), status, updatedAt: now() };
    this.replace(updated);
    return updated;
  }

  remove(id: string): void {
    this.categories = this.categories.filter(
      (category) => category.id !== id && category.parentId !== id,
    );
  }

  private placeUnderParent(
    draft: CategoryDraft,
  ): Omit<Category, 'id' | 'placeCount' | 'status' | 'updatedAt'> {
    if (draft.kind === 'main') {
      return { ...draft, parentId: null, parentName: null };
    }
    const parent = this.categories.find(
      (category) => category.id === draft.parentId && category.kind === 'main',
    );
    if (!parent) {
      throw new Error(MISSING_PARENT_MESSAGE);
    }
    return { ...draft, parentId: parent.id, parentName: parent.name };
  }

  private renameParentOfSubCategories(parent: Category): void {
    this.categories = this.categories.map((category) =>
      category.parentId === parent.id ? { ...category, parentName: parent.name } : category,
    );
  }

  private findOrThrow(id: string): Category {
    const category = this.categories.find((candidate) => candidate.id === id);
    if (!category) {
      throw new Error(`لم يتم العثور على التصنيف ${id}`);
    }
    return category;
  }

  private replace(next: Category): void {
    this.categories = this.categories.map((category) =>
      category.id === next.id ? next : category,
    );
  }
}

function now(): string {
  return new Date().toISOString();
}
