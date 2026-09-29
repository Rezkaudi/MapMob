import { FormArray, FormControl } from '@angular/forms';
import { DeliveryLinkRow } from '../models/delivery-link-row';
import { StoreDeliveryLink } from '../models/store-delivery-link';
import { DeliveryLinkFormGroup } from './delivery-link-form';
import { LINK_MESSAGE } from './store-field-errors';

const MISSING_LINK_MESSAGE = 'أدخل رابط متجرك على المنصة';

function findLinkError(storeUrl: FormControl<string>): string | null {
  if (!storeUrl.touched || storeUrl.valid) {
    return null;
  }
  return storeUrl.hasError('required') ? MISSING_LINK_MESSAGE : LINK_MESSAGE;
}

export function toDeliveryLinkRows(
  savedLinks: readonly StoreDeliveryLink[],
  linkForms: FormArray<DeliveryLinkFormGroup>,
): DeliveryLinkRow[] {
  return savedLinks.map((saved, index) => {
    const { isEnabled, storeUrl } = linkForms.at(index).controls;
    return {
      index,
      platform: saved.platform,
      isEnabled: isEnabled.value,
      storeUrl: storeUrl.value,
      canOpen: isEnabled.value && storeUrl.valid,
      error: findLinkError(storeUrl),
    };
  });
}
