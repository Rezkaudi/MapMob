import { OfferSavedStatus } from '../../../shared/models/offer-saved-status';
import { OfferDraft } from '../models/offer-draft';
import { LIVE_ACTIVE_OFFER_STATUS, LIVE_PAUSED_OFFER_STATUS } from './live-offer-status';

const LIVE_STATUS: Record<OfferSavedStatus, string> = {
  active: LIVE_ACTIVE_OFFER_STATUS,
  paused: LIVE_PAUSED_OFFER_STATUS,
  // The server rejects "draft", so a draft is saved as a stopped offer.
  draft: LIVE_PAUSED_OFFER_STATUS,
};
// An empty product makes the offer cover everything the store sells.
const EVERY_PRODUCT = '';

/** Multipart, so the picture travels with the fields. The form has one language; the server asks for two. */
export function toOfferFormData(draft: OfferDraft): FormData {
  const data = new FormData();
  data.set('store_id', draft.placeId);
  // The server keeps one product per offer, so only the first picked item is saved.
  data.set(
    'product_id',
    draft.scope === 'selectedItems' ? (draft.itemIds[0] ?? EVERY_PRODUCT) : EVERY_PRODUCT,
  );
  data.set('title[ar]', draft.title);
  data.set('title[en]', draft.title);
  data.set('description[ar]', draft.description);
  data.set('description[en]', draft.description);
  data.set('discount_percentage', String(draft.discountPercent));
  data.set('starts_at', draft.startsOn);
  data.set('ends_at', draft.endsOn);
  data.set('status', LIVE_STATUS[draft.status]);
  if (draft.image) {
    data.set('image', draft.image);
  }
  return data;
}
