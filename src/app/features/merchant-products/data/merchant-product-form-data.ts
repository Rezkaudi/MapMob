import { liveOwnerStatusOf } from '../../../shared/data/live-owner-status';
import { ProductDraft } from '../../../shared/models/product-draft';

const YES = '1';
const NO = '0';

/** Multipart, so a picked picture travels with the fields. */
export function toNewProductFormData(draft: ProductDraft): FormData {
  const data = new FormData();
  data.set('name[ar]', draft.name);
  data.set('price', String(draft.price));
  data.set('currencyCode', draft.currency);
  data.set('status', liveOwnerStatusOf(draft.isAvailable));
  if (draft.orderUrl) {
    data.set('orderUrl', draft.orderUrl);
  }
  if (draft.imageFile) {
    data.set('image', draft.imageFile);
  }
  return data;
}

/** POST with `_method=PUT`, as PHP reads no multipart body on a real PUT. */
export function toProductUpdateFormData(draft: ProductDraft): FormData {
  const data = toNewProductFormData(draft);
  data.set('_method', 'PUT');
  data.set('isImageRemoved', draft.imageUrl === '' ? YES : NO);
  return data;
}
