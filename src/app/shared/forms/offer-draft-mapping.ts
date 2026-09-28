import { CampaignStatus } from '../models/campaign-status';
import { OfferDraftFields } from '../models/offer-draft-fields';
import { OfferSavedStatus } from '../models/offer-saved-status';
import { OfferScope } from '../models/offer-scope';
import { UploadedImage } from '../ui/image-upload-field/uploaded-image';
import { OfferFieldsValue } from './offer-form-controls';

export interface OfferDraftExtras {
  readonly image: UploadedImage | null;
  /** Whether the offer had a picture when the form opened. */
  readonly hadSavedImage: boolean;
  readonly status: OfferSavedStatus;
}

/** A saved offer as far as the shared fields are concerned. */
export interface SavedOfferFields {
  readonly title: string;
  readonly discountPercent: number;
  readonly startsOn: string;
  readonly endsOn: string;
  readonly status: CampaignStatus;
  readonly description: string | null;
  readonly scope: OfferScope;
  readonly itemIds: readonly string[];
}

/** "حالة العرض" keeps "متوقف" and shows anything else as "نشط". */
export function toOfferFieldsValue(saved: SavedOfferFields): OfferFieldsValue {
  return {
    title: saved.title,
    discountPercent: saved.discountPercent,
    startsOn: saved.startsOn,
    endsOn: saved.endsOn,
    status: saved.status === 'paused' ? 'paused' : 'active',
    description: saved.description ?? '',
    scope: saved.scope,
    itemIds: saved.itemIds,
  };
}

export function toOfferDraftFields(
  value: OfferFieldsValue,
  extras: OfferDraftExtras,
): OfferDraftFields {
  return {
    title: value.title.trim(),
    discountPercent: value.discountPercent ?? 0,
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
