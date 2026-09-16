import { UploadedImage } from '../../../shared/ui/image-upload-field/uploaded-image';
import { AdDetail } from '../models/ad-detail';
import { AdDraft, AdSavedStatus } from '../models/ad-draft';
import { AdFormValue } from './ad-form-group';

export interface AdDraftExtras {
  readonly media: UploadedImage | null;
  /** Whether the ad had media when the form opened. */
  readonly hadSavedMedia: boolean;
  readonly status: AdSavedStatus;
}

export function toAdFormValue(detail: AdDetail): AdFormValue {
  const { ad } = detail;
  return {
    title: ad.title,
    advertiserType: ad.advertiserType,
    placeId: detail.placeId ?? '',
    contentType: ad.contentType,
    text: detail.text,
    placement: ad.placement,
    position: detail.position,
    startsOn: ad.startsOn,
    endsOn: ad.endsOn,
    isOngoing: ad.endsOn === null,
    priority: ad.priority,
    status: ad.status === 'paused' ? 'paused' : 'active',
  };
}

export function toAdDraft(value: AdFormValue, extras: AdDraftExtras): AdDraft {
  const isStoreAd = value.advertiserType === 'place';
  return {
    title: value.title.trim(),
    advertiserType: value.advertiserType,
    placeId: isStoreAd ? value.placeId : null,
    contentType: value.contentType,
    text: value.text.trim(),
    placement: value.placement,
    position: value.position,
    startsOn: value.startsOn ?? '',
    endsOn: value.isOngoing ? null : value.endsOn,
    priority: value.priority,
    status: extras.status,
    media: extras.media?.file ?? null,
    isMediaRemoved: extras.hadSavedMedia && extras.media === null,
  };
}
