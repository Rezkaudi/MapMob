import { PlaceOwner } from '../models/place-owner';
import { PlaceFormValue } from '../state/place-form-group';
import { findOwnerLoginChanges } from './owner-login-changes';
import { PlaceIds } from './live-place-choices';
import { toLivePlaceStatus } from './live-place-mapping';

export type StoreSaveMode = 'create' | 'update';

// A new place sends its whole owner; an update sends only the login fields that changed.
const NEW_OWNER_FIELDS = ['ownerName', 'ownerPhone', 'ownerEmail', 'ownerPassword'] as const;
const OPTIONAL_TEXT_FIELDS = [
  'extraPhone',
  'website',
  'facebook',
  'instagram',
  'telegram',
] as const;

function setIfFilled(form: FormData, name: string, value: string | null): void {
  if (value) {
    form.set(name, value);
  }
}

/** The panel has one language per field, so the English text repeats the Arabic one. */
function setTranslated(form: FormData, name: string, value: string): void {
  form.set(`${name}[ar]`, value);
  form.set(`${name}[en]`, value);
}

/** The store's own fields; hours, media, products and links are saved on their own routes. */
export function toLiveStoreForm(
  value: PlaceFormValue,
  ids: PlaceIds,
  mode: StoreSaveMode,
  previousOwner: PlaceOwner | null = null,
): FormData {
  const form = new FormData();
  if (mode === 'update') {
    form.set('_method', 'PUT');
  }
  setTranslated(form, 'name', value.name);
  setTranslated(form, 'address', value.address);
  if (value.description) {
    setTranslated(form, 'description', value.description);
  }
  setIfFilled(form, 'mainCategoryId', ids.mainCategoryId);
  setIfFilled(form, 'subCategoryId', ids.subCategoryId);
  setIfFilled(form, 'governorateId', ids.governorateId);
  setIfFilled(form, 'areaId', ids.areaId);
  form.set('latitude', String(value.latitude));
  form.set('longitude', String(value.longitude));
  form.set('phone', value.phone);
  setIfFilled(form, 'whatsapp', value.useMainPhoneForWhatsapp ? value.phone : value.whatsapp);
  for (const field of OPTIONAL_TEXT_FIELDS) {
    setIfFilled(form, field, value[field]);
  }
  form.set('status', toLivePlaceStatus(value.status));
  if (mode === 'create') {
    for (const field of NEW_OWNER_FIELDS) {
      setIfFilled(form, field, value[field]);
    }
    return form;
  }
  for (const field of findOwnerLoginChanges(value, previousOwner)) {
    form.set(field, value[field]);
  }
  return form;
}
