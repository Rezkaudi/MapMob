import { StoreProfileUpdate } from '../models/store-profile-update';

const OPTIONAL_TEXT_FIELDS = [
  'description',
  'email',
  'whatsapp',
  'facebook',
  'instagram',
  'telegram',
] as const;

/** Multipart, so a new cover travels with the fields. Empty optional fields are left out. */
export function toStoreProfileFormData(update: StoreProfileUpdate): FormData {
  const data = new FormData();
  data.set('name', update.name);
  data.set('phone', update.phone);
  for (const field of OPTIONAL_TEXT_FIELDS) {
    const value = update[field];
    if (value !== null) {
      data.set(field, value);
    }
  }
  data.set('address', update.address);
  data.set('latitude', String(update.latitude));
  data.set('longitude', String(update.longitude));
  data.set('isOpen24Hours', String(update.isOpen24Hours));
  update.workingHours.forEach((day, index) => {
    const prefix = `workingHours[${index}]`;
    data.set(`${prefix}[day]`, day.day);
    data.set(`${prefix}[isOpen]`, String(day.isOpen));
    if (day.openTime !== null && day.closeTime !== null) {
      data.set(`${prefix}[openTime]`, day.openTime);
      data.set(`${prefix}[closeTime]`, day.closeTime);
    }
  });
  update.deliveryLinks.forEach((link, index) => {
    const prefix = `deliveryLinks[${index}]`;
    data.set(`${prefix}[platformId]`, link.platformId);
    data.set(`${prefix}[isEnabled]`, String(link.isEnabled));
    if (link.storeUrl !== null) {
      data.set(`${prefix}[storeUrl]`, link.storeUrl);
    }
  });
  if (update.cover) {
    data.set('cover', update.cover);
  }
  return data;
}
