import { UploadedImage } from '../../../shared/ui/image-upload-field/uploaded-image';
import { OfferDetail } from '../models/offer-detail';
import { OfferDraft, OfferSavedStatus } from '../models/offer-draft';
import { OfferFormValue } from './offer-form-group';

export interface OfferDraftExtras {
  readonly image: UploadedImage | null;
  /** Whether the offer had a picture when the form opened. */
  readonly hadSavedImage: boolean;
  readonly status: OfferSavedStatus;
}

export function toOfferFormValue(detail: OfferDetail): OfferFormValue {
  const { offer } = detail;
  return {
    title: offer.title,
    discountPercent: detail.discountPercent,
    placeId: detail.place.id,
    categoryName: offer.categoryName,
    startsOn: offer.startsOn,
    endsOn: offer.endsOn,
    status: offer.status === 'paused' ? 'paused' : 'active',
    description: detail.description,
    scope: detail.scope,
    itemIds: detail.itemIds,
  };
}

export function toOfferDraft(value: OfferFormValue, extras: OfferDraftExtras): OfferDraft {
  return {
    title: value.title.trim(),
    discountPercent: value.discountPercent ?? 0,
    placeId: value.placeId,
    categoryName: value.categoryName,
    startsOn: value.startsOn ?? '',
    endsOn: value.endsOn ?? '',
    status: extras.status,
    description: value.description.trim(),
    scope: value.scope,
    itemIds: value.itemIds,
    image: extras.image?.file ?? null,
    isImageRemoved: extras.hadSavedImage && extras.image === null,
  };
}
