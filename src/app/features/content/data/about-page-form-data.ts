import { AboutPageDraft } from '../models/about-page-draft';

/** Multipart, so the banner travels with the fields. */
export function toAboutPageFormData(draft: AboutPageDraft): FormData {
  const data = new FormData();
  data.set('title', draft.title);
  data.set('summary', draft.summary);
  data.set('phone', draft.phone);
  data.set('email', draft.email);
  data.set('address', draft.address);
  data.set('status', draft.status);
  if (draft.banner) {
    data.set('banner', draft.banner);
  }
  data.set('isBannerRemoved', String(draft.isBannerRemoved));
  return data;
}
