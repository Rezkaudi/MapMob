import { toNameSlug } from '../../../shared/data/name-slug';
import { EditedPlaceProduct } from '../models/edited-place-product';
import { WorkingDay } from '../models/working-day';

export type LiveMediaType = 'image' | 'video';
export type PartSaveMode = 'create' | 'update';

// The server numbers days like JavaScript: 0 is Sunday.
const SERVER_DAY_ORDER = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const SLUG_KEY_LENGTH = 8;

export interface LiveWorkingHourBody {
  readonly day_of_week: number;
  readonly is_open: boolean;
  readonly open_time: string;
  readonly close_time: string;
}

export function toServerDay(dayName: string): number {
  return SERVER_DAY_ORDER.indexOf(dayName);
}

export function toLiveWorkingHourBody(day: WorkingDay): LiveWorkingHourBody {
  return {
    day_of_week: toServerDay(day.day),
    is_open: day.isOpen,
    open_time: day.opensAt,
    close_time: day.closesAt,
  };
}

/** Slugs must be unique, so a new product's slug carries the place id and its own key. */
export function toLiveProductForm(
  product: EditedPlaceProduct,
  storeId: string,
  categoryId: string,
  mode: PartSaveMode,
): FormData {
  const form = new FormData();
  if (mode === 'update') {
    form.set('_method', 'PUT');
  } else {
    const key = product.id.slice(0, SLUG_KEY_LENGTH);
    form.set('slug', `${toNameSlug(product.name)}-${storeId}-${key}`);
  }
  form.set('store_id', storeId);
  form.set('category_id', categoryId);
  form.set('name[ar]', product.name);
  form.set('name[en]', product.name);
  form.set('price', String(product.price));
  form.set('currency_code', product.currency);
  form.set('status', product.isAvailable ? 'active' : 'inactive');
  if (product.imageFile) {
    form.set('image', product.imageFile);
  }
  return form;
}

export function toLiveMediaForm(file: File, type: LiveMediaType, sortOrder: number): FormData {
  const form = new FormData();
  form.set('type', type);
  form.set('media', file);
  form.set('sort_order', String(sortOrder));
  return form;
}

export function toLiveDeliveryLinkBody(platform: string, url: string, sortOrder: number) {
  return { platform, url, is_active: true, sort_order: sortOrder };
}
