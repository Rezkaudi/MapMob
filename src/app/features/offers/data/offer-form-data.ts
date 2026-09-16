import { OfferDraft } from '../models/offer-draft';

/** Multipart, so the picture travels with the fields. */
export function toOfferFormData(draft: OfferDraft): FormData {
  const data = new FormData();
  data.set('title', draft.title);
  data.set('discountPercent', String(draft.discountPercent));
  data.set('placeId', draft.placeId);
  data.set('categoryName', draft.categoryName);
  data.set('startsOn', draft.startsOn);
  data.set('endsOn', draft.endsOn);
  data.set('status', draft.status);
  data.set('description', draft.description);
  data.set('scope', draft.scope);
  if (draft.scope === 'selectedItems') {
    draft.itemIds.forEach((itemId) => data.append('itemIds', itemId));
  }
  if (draft.image) {
    data.set('image', draft.image);
  }
  data.set('isImageRemoved', String(draft.isImageRemoved));
  return data;
}
