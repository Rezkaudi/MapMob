import { FormBuilder, Validators } from '@angular/forms';
import { contactEmail, phoneNumber, webAddress } from '../../../shared/forms/contact-validators';
import { StoreWorkingDay } from '../models/store-working-day';
import { DeliveryLinkFormGroup } from '../../../shared/forms/delivery-link-form';

export const DESCRIPTION_MAX_LENGTH = 300;
const NAME_MAX_LENGTH = 150;
const ADDRESS_MAX_LENGTH = 255;

export function createStoreProfileFormGroup(formBuilder: FormBuilder) {
  const builder = formBuilder.nonNullable;
  return builder.group({
    name: builder.control('', [Validators.required, Validators.maxLength(NAME_MAX_LENGTH)]),
    description: builder.control('', [
      Validators.required,
      Validators.maxLength(DESCRIPTION_MAX_LENGTH),
    ]),
    phone: builder.control('', [Validators.required, phoneNumber]),
    email: builder.control('', contactEmail),
    whatsapp: builder.control('', phoneNumber),
    facebook: builder.control('', webAddress),
    instagram: builder.control('', webAddress),
    telegram: builder.control('', webAddress),
    address: builder.control('', [Validators.required, Validators.maxLength(ADDRESS_MAX_LENGTH)]),
    latitude: builder.control(0),
    longitude: builder.control(0),
    isOpen24Hours: builder.control(false),
    workingHours: builder.control<readonly StoreWorkingDay[]>([]),
    deliveryLinks: builder.array<DeliveryLinkFormGroup>([]),
  });
}

export type StoreProfileFormGroup = ReturnType<typeof createStoreProfileFormGroup>;
export type StoreProfileFormValue = ReturnType<StoreProfileFormGroup['getRawValue']>;
