import { toNameSlug } from '../../../shared/data/name-slug';
import { Category } from '../models/category';
import { DEFAULT_CATEGORY_COLOR } from '../models/category-color';
import { CategoryDraft } from '../models/category-draft';
import { LiveCategory } from './live-category';

// An empty translation comes back as `[]`, so the plain name is the fallback.
function arabicNameOf(category: LiveCategory): string {
  const translations = category.translations?.name;
  const arabic = translations && 'ar' in translations ? translations.ar : undefined;
  return arabic || category.name;
}

function parentNameOf(
  category: LiveCategory,
  allCategories: readonly LiveCategory[],
): string | null {
  if (!category.parent) {
    return null;
  }
  const parent = allCategories.find((candidate) => candidate.id === category.parent?.id);
  return parent ? arabicNameOf(parent) : category.parent.name;
}

/** The icon is only known as the uploaded picture, so `icon` stays empty. */
export function toCategory(
  category: LiveCategory,
  allCategories: readonly LiveCategory[],
): Category {
  return {
    id: String(category.id),
    name: arabicNameOf(category),
    kind: category.parent_id === null ? 'main' : 'sub',
    parentId: category.parent_id === null ? null : String(category.parent_id),
    parentName: parentNameOf(category, allCategories),
    icon: '',
    iconUrl: category.icon,
    color: category.icon_color ?? DEFAULT_CATEGORY_COLOR,
    placeCount: category.stores_count ?? 0,
    status: category.is_active ? 'active' : 'suspended',
    updatedAt: category.updated_at,
  };
}

/** The panel has one name field, so the English name repeats the Arabic one. */
export function toLiveCategoryForm(draft: CategoryDraft, iconFile: File | null): FormData {
  const form = new FormData();
  form.set('name[ar]', draft.name);
  form.set('name[en]', draft.name);
  form.set('slug', toNameSlug(draft.name));
  form.set('parent_id', draft.kind === 'sub' && draft.parentId ? draft.parentId : '');
  form.set('icon_color', draft.color);
  if (iconFile) {
    form.set('icon', iconFile);
  }
  return form;
}
