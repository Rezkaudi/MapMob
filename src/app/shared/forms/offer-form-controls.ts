import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OfferSavedStatus } from '../models/offer-saved-status';
import { OfferScope } from '../models/offer-scope';
import { hasText } from './has-text';
import { offerPeriodValidator, selectedItemsValidator } from './offer-form-validators';

/** The statuses "حالة العرض" lists; a draft comes from "حفظ كمسودة" instead. */
export type OfferFormStatus = Exclude<OfferSavedStatus, 'draft'>;

const LOWEST_DISCOUNT_PERCENT = 1;
const HIGHEST_DISCOUNT_PERCENT = 100;

export const OFFER_FORM_VALIDATORS = [offerPeriodValidator, selectedItemsValidator];

/** The fields every offer form has; the admin form adds its place and category. */
export function createOfferFormControls() {
  return {
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, hasText],
    }),
    discountPercent: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(LOWEST_DISCOUNT_PERCENT),
      Validators.max(HIGHEST_DISCOUNT_PERCENT),
    ]),
    startsOn: new FormControl<string | null>(null, Validators.required),
    endsOn: new FormControl<string | null>(null, Validators.required),
    status: new FormControl<OfferFormStatus>('active', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    scope: new FormControl<OfferScope>('allItems', { nonNullable: true }),
    itemIds: new FormControl<readonly string[]>([], { nonNullable: true }),
  };
}

export type OfferFormControls = ReturnType<typeof createOfferFormControls>;

/** The place owner's offer form: the shared fields and nothing else. */
export function createOfferFieldsFormGroup() {
  return new FormGroup(createOfferFormControls(), { validators: OFFER_FORM_VALIDATORS });
}

export type OfferFieldsFormGroup = ReturnType<typeof createOfferFieldsFormGroup>;
export type OfferFieldsValue = ReturnType<OfferFieldsFormGroup['getRawValue']>;
