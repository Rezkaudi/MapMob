import { DeliveryPlatformDraft } from '../models/delivery-platform-draft';

/** Multipart, so a new logo travels with the fields. */
export function toDeliveryPlatformFormData(draft: DeliveryPlatformDraft): FormData {
  const data = new FormData();
  data.set('name', draft.name);
  data.set('latinName', draft.latinName);
  data.set('websiteUrl', draft.websiteUrl);
  data.set('status', draft.status);
  data.set('sortOrder', String(draft.sortOrder));
  if (draft.logoFile) {
    data.set('logo', draft.logoFile);
  } else if (draft.logoUrl === null) {
    data.set('removeLogo', 'true');
  }
  return data;
}
