import {
  OfferDraftExtras,
  toOfferDraftFields,
  toOfferFieldsValue,
} from '../../../shared/forms/offer-draft-mapping';
import { OfferDetail } from '../models/offer-detail';
import { OfferDraft } from '../models/offer-draft';
import { OfferFormValue } from './offer-form-group';

export function toOfferFormValue(detail: OfferDetail): OfferFormValue {
  const { offer } = detail;
  return {
    ...toOfferFieldsValue({
      ...detail,
      title: offer.title,
      startsOn: offer.startsOn,
      endsOn: offer.endsOn,
      status: offer.status,
    }),
    placeId: detail.place.id,
    categoryName: offer.categoryName,
  };
}

export function toOfferDraft(value: OfferFormValue, extras: OfferDraftExtras): OfferDraft {
  return {
    ...toOfferDraftFields(value, extras),
    placeId: value.placeId,
    categoryName: value.categoryName,
  };
}
