import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { OfferScope } from '../models/offer-scope';
import { OfferSavedStatus } from '../models/offer-draft';
import { offerPeriodValidator, selectedItemsValidator } from './offer-form-validators';

/** The statuses "حالة العرض" lists; a draft comes from "حفظ كمسودة" instead. */
export type OfferFormStatus = Exclude<OfferSavedStatus, 'draft'>;

const LOWEST_DISCOUNT_PERCENT = 1;
const HIGHEST_DISCOUNT_PERCENT = 100;
const HAS_TEXT = /\S/;

export function createOfferFormGroup(formBuilder: FormBuilder) {
  const builder = formBuilder.nonNullable;
  return builder.group(
    {
      title: builder.control('', [Validators.required, Validators.pattern(HAS_TEXT)]),
      discountPercent: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(LOWEST_DISCOUNT_PERCENT),
        Validators.max(HIGHEST_DISCOUNT_PERCENT),
      ]),
      placeId: builder.control('', Validators.required),
      categoryName: builder.control('', Validators.required),
      startsOn: new FormControl<string | null>(null, Validators.required),
      endsOn: new FormControl<string | null>(null, Validators.required),
      status: builder.control<OfferFormStatus>('active'),
      description: builder.control(''),
      scope: builder.control<OfferScope>('allItems'),
      itemIds: builder.control<readonly string[]>([]),
    },
    { validators: [offerPeriodValidator, selectedItemsValidator] },
  );
}

export type OfferFormGroup = ReturnType<typeof createOfferFormGroup>;
export type OfferFormValue = ReturnType<OfferFormGroup['getRawValue']>;
