import { AdDraft } from '../models/ad-draft';

/** Multipart, so the picture or video travels with the fields. */
export function toAdFormData(draft: AdDraft): FormData {
  const data = new FormData();
  data.set('title', draft.title);
  data.set('advertiserType', draft.advertiserType);
  if (draft.advertiserType === 'place' && draft.placeId) {
    data.set('placeId', draft.placeId);
  }
  data.set('contentType', draft.contentType);
  data.set('text', draft.text);
  data.set('placement', draft.placement);
  data.set('position', draft.position);
  data.set('startsOn', draft.startsOn);
  if (draft.endsOn) {
    data.set('endsOn', draft.endsOn);
  }
  data.set('priority', String(draft.priority));
  data.set('status', draft.status);
  if (draft.media) {
    data.set('media', draft.media);
  }
  data.set('isMediaRemoved', String(draft.isMediaRemoved));
  return data;
}
