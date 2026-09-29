import { FormArray } from '@angular/forms';
import { DeliveryLinkRow } from '../models/delivery-link-row';
import { DeliveryLink } from '../../../shared/models/delivery-link';
import {
  DeliveryLinkFormGroup,
  findDeliveryLinkError,
} from '../../../shared/forms/delivery-link-form';

const MISSING_LINK_MESSAGE = 'أدخل رابط متجرك على المنصة';

export function toDeliveryLinkRows(
  savedLinks: readonly DeliveryLink[],
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
      error: findDeliveryLinkError(storeUrl, MISSING_LINK_MESSAGE),
    };
  });
}
