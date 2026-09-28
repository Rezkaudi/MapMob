import { OfferDraftFields } from '../models/offer-draft-fields';

/** Multipart, so the picture travels with the fields. */
export function toOfferDraftFormData(draft: OfferDraftFields): FormData {
  const data = new FormData();
  data.set('title', draft.title);
  data.set('discountPercent', String(draft.discountPercent));
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
