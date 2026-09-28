import { toOfferDraftFormData } from '../../../shared/forms/offer-draft-form-data';
import { OfferDraft } from '../models/offer-draft';

/** Multipart, so the picture travels with the fields. */
export function toOfferFormData(draft: OfferDraft): FormData {
  const data = toOfferDraftFormData(draft);
  data.set('placeId', draft.placeId);
  data.set('categoryName', draft.categoryName);
  return data;
}
