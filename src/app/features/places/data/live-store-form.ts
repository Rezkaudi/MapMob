import { PlaceFormValue } from '../state/place-form-group';
import { PlaceIds } from './live-place-choices';
import { toLivePlaceStatus } from './live-place-mapping';

export type StoreSaveMode = 'create' | 'update';

// Saving these on an update makes the server fail, so they go out on create only.
const CREATE_ONLY_FIELDS = ['ownerName', 'ownerPhone', 'ownerExtraPhone'] as const;
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
    for (const field of CREATE_ONLY_FIELDS) {
      setIfFilled(form, field, value[field]);
    }
  }
  return form;
}
