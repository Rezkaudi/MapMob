import { FormBuilder, Validators } from '@angular/forms';
import {
  OFFER_FORM_VALIDATORS,
  createOfferFormControls,
} from '../../../shared/forms/offer-form-controls';

export function createOfferFormGroup(formBuilder: FormBuilder) {
  const builder = formBuilder.nonNullable;
  return builder.group(
    {
      ...createOfferFormControls(),
      placeId: builder.control('', Validators.required),
      categoryName: builder.control('', Validators.required),
    },
    { validators: OFFER_FORM_VALIDATORS },
  );
}

export type OfferFormGroup = ReturnType<typeof createOfferFormGroup>;
export type OfferFormValue = ReturnType<OfferFormGroup['getRawValue']>;
