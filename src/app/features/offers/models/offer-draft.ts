import { OfferDraftFields } from '../../../shared/models/offer-draft-fields';

/** What the admin add and edit forms send: the shared fields plus the place and its category. */
export interface OfferDraft extends OfferDraftFields {
  readonly placeId: string;
  readonly categoryName: string;
}
