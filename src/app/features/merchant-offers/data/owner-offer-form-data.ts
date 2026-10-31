import { LIVE_ACTIVE, LIVE_INACTIVE } from '../../../shared/data/live-owner-status';
import { OfferDraftFields } from '../../../shared/models/offer-draft-fields';

const YES = '1';

/**
 * Multipart, so the picture travels with the fields. The server shows the English title,
 * so the one title box fills both languages. It takes one product, so the first picked one goes.
 */
export function toOwnerOfferFormData(draft: OfferDraftFields): FormData {
  const data = new FormData();
  data.set('title[ar]', draft.title);
  data.set('title[en]', draft.title);
  if (draft.description) {
    data.set('description[ar]', draft.description);
    data.set('description[en]', draft.description);
  }
  data.set('discountPercentage', String(draft.discountPercent));
  data.set('startsAt', draft.startsOn);
  data.set('endsAt', draft.endsOn);
  data.set('status', draft.status === 'active' ? LIVE_ACTIVE : LIVE_INACTIVE);
  const [firstItemId] = draft.itemIds;
  if (draft.scope === 'selectedItems' && firstItemId) {
    data.set('productId', firstItemId);
  }
  if (draft.image) {
    data.set('image', draft.image);
  }
  if (draft.isImageRemoved) {
    data.set('isImageRemoved', YES);
  }
  return data;
}

/** POST with `_method=PUT`, as PHP reads no multipart body on a real PUT. */
export function toOwnerOfferUpdateFormData(draft: OfferDraftFields): FormData {
  const data = toOwnerOfferFormData(draft);
  data.set('_method', 'PUT');
  return data;
}
