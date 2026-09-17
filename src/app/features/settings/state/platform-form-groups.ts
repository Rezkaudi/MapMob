import { FormControl, FormGroup, Validators } from '@angular/forms';
import { contactEmail, phoneNumber } from '../../../shared/forms/contact-validators';
import { hasText } from '../../../shared/forms/has-text';
import { AppLanguage } from '../models/app-language';
import { CurrencyCode } from '../models/currency-code';
import { DecimalPlaces } from '../models/decimal-places';
import { DistanceUnit } from '../models/distance-unit';

export const MIN_SEARCH_RADIUS_KM = 1;
export const MAX_SEARCH_RADIUS_KM = 100;

const WHOLE_NUMBER = /^\d+$/;

export function createPlatformGeneralFormGroup() {
  return new FormGroup({
    appName: new FormControl('', { nonNullable: true, validators: [Validators.required, hasText] }),
    supportEmail: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, contactEmail],
    }),
    supportPhone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, phoneNumber],
    }),
  });
}

export function createMapSettingsFormGroup() {
  return new FormGroup({
    distanceUnit: new FormControl<DistanceUnit>('kilometer', { nonNullable: true }),
    searchRadiusKm: new FormControl(MIN_SEARCH_RADIUS_KM, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(MIN_SEARCH_RADIUS_KM),
        Validators.max(MAX_SEARCH_RADIUS_KM),
        Validators.pattern(WHOLE_NUMBER),
      ],
    }),
  });
}

export function createLanguageSettingsFormGroup() {
  return new FormGroup({
    defaultLanguage: new FormControl<AppLanguage>('ar', { nonNullable: true }),
    detectsDeviceLanguage: new FormControl(false, { nonNullable: true }),
  });
}

export function createCurrencySettingsFormGroup() {
  return new FormGroup({
    currency: new FormControl<CurrencyCode>('SYP', { nonNullable: true }),
    currencySymbol: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, hasText],
    }),
    decimalPlaces: new FormControl<DecimalPlaces>(0, { nonNullable: true }),
  });
}
