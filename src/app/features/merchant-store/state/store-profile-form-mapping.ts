import { StoreProfile } from '../models/store-profile';
import { StoreProfileUpdate } from '../models/store-profile-update';
import { StoreProfileFormValue } from './store-profile-form-group';
import { toSavedWeek } from './working-week-editing';

function toOptionalText(text: string): string | null {
  const trimmed = text.trim();
  return trimmed === '' ? null : trimmed;
}

export function toStoreProfileFormValue(profile: StoreProfile): StoreProfileFormValue {
  const { contact, location } = profile;
  return {
    name: profile.name,
    description: profile.description ?? '',
    phone: contact.phone,
    email: contact.email ?? '',
    whatsapp: contact.whatsapp ?? '',
    facebook: contact.facebook ?? '',
    instagram: contact.instagram ?? '',
    telegram: contact.telegram ?? '',
    address: location.address,
    latitude: location.latitude,
    longitude: location.longitude,
    isOpen24Hours: profile.isOpen24Hours,
    workingHours: profile.workingHours,
  };
}

export function toStoreProfileUpdate(
  value: StoreProfileFormValue,
  cover: File | null,
): StoreProfileUpdate {
  return {
    name: value.name.trim(),
    description: toOptionalText(value.description),
    phone: value.phone.trim(),
    email: toOptionalText(value.email),
    whatsapp: toOptionalText(value.whatsapp),
    facebook: toOptionalText(value.facebook),
    instagram: toOptionalText(value.instagram),
    telegram: toOptionalText(value.telegram),
    address: value.address.trim(),
    latitude: value.latitude,
    longitude: value.longitude,
    isOpen24Hours: value.isOpen24Hours,
    workingHours: toSavedWeek(value.workingHours),
    cover,
  };
}
