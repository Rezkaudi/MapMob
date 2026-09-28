import { ProductDraft } from '../../../shared/models/product-draft';

/** Multipart, so a picked picture travels with the fields. */
export function toNewProductFormData(draft: ProductDraft): FormData {
  const data = new FormData();
  data.set('name', draft.name);
  data.set('price', String(draft.price));
  data.set('currency', draft.currency);
  data.set('isAvailable', String(draft.isAvailable));
  if (draft.orderUrl) {
    data.set('orderUrl', draft.orderUrl);
  }
  if (draft.imageFile) {
    data.set('image', draft.imageFile);
  }
  return data;
}

/** An update also says whether the saved picture was cleared in the dialog. */
export function toProductUpdateFormData(draft: ProductDraft): FormData {
  const data = toNewProductFormData(draft);
  data.set('isImageRemoved', String(draft.imageUrl === ''));
  return data;
}
