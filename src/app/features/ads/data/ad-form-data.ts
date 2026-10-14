import { AdDraft } from '../models/ad-draft';
import { toLiveAdPlacement } from './live-ad-placement';
import { LIVE_ACTIVE_AD_STATUS, LIVE_PAUSED_AD_STATUS } from './live-ad-status';

const FIRST_MEDIA_ORDER = '1';

// The panel writes one language; the server wants both, so the same text goes in each.
function setBothLanguages(data: FormData, name: string, value: string): void {
  data.set(`${name}[ar]`, value);
  data.set(`${name}[en]`, value);
}

/** Multipart, so the picture or video travels with the fields. */
export function toAdFormData(draft: AdDraft): FormData {
  const data = new FormData();
  setBothLanguages(data, 'title', draft.title);
  if (draft.text) {
    setBothLanguages(data, 'description', draft.text);
  }
  if (draft.advertiserType === 'place' && draft.placeId) {
    data.set('store_id', draft.placeId);
  }
  data.set('placement', toLiveAdPlacement(draft.placement));
  data.set('starts_at', draft.startsOn);
  if (draft.endsOn) {
    data.set('ends_at', draft.endsOn);
  }
  data.set('priority', String(draft.priority));
  // The server keeps no drafts, so a draft waits as a paused ad.
  data.set('status', draft.status === 'active' ? LIVE_ACTIVE_AD_STATUS : LIVE_PAUSED_AD_STATUS);
  if (draft.media) {
    data.set('media[0][type]', draft.contentType);
    data.set('media[0][file]', draft.media);
    data.set('media[0][sort_order]', FIRST_MEDIA_ORDER);
  }
  return data;
}
