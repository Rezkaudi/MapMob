import { FormBuilder, Validators } from '@angular/forms';
import { PlacePackage } from '../models/place-package';
import { PlaceStatus } from '../models/place-status';

/** Tartus, the city the design centres its map on. */
const DEFAULT_LATITUDE = 34.8959;
const DEFAULT_LONGITUDE = 35.8866;
const DEFAULT_PACKAGE: PlacePackage = 'free';
const DEFAULT_STATUS: PlaceStatus = 'pending';

export function createPlaceFormGroup(formBuilder: FormBuilder) {
  const builder = formBuilder.nonNullable;
  return builder.group({
    name: builder.control('', Validators.required),
    ownerName: builder.control(''),
    ownerPhone: builder.control('', Validators.required),
    ownerExtraPhone: builder.control(''),
    mainCategory: builder.control('', Validators.required),
    subCategory: builder.control(''),
    city: builder.control('', Validators.required),
    region: builder.control('', Validators.required),
    address: builder.control('', Validators.required),
    latitude: builder.control(DEFAULT_LATITUDE),
    longitude: builder.control(DEFAULT_LONGITUDE),
    phone: builder.control('', Validators.required),
    extraPhone: builder.control(''),
    website: builder.control(''),
    whatsapp: builder.control(''),
    useMainPhoneForWhatsapp: builder.control(false),
    facebook: builder.control(''),
    instagram: builder.control(''),
    telegram: builder.control(''),
    description: builder.control(''),
    package: builder.control<PlacePackage>(DEFAULT_PACKAGE, Validators.required),
    status: builder.control<PlaceStatus>(DEFAULT_STATUS, Validators.required),
  });
}

export type PlaceFormGroup = ReturnType<typeof createPlaceFormGroup>;
export type PlaceFormValue = ReturnType<PlaceFormGroup['getRawValue']>;
