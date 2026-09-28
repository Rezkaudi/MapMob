import { OfferFieldErrors, buildOfferFieldErrors } from '../../../shared/forms/offer-form-errors';
import { touchedError } from '../../../shared/forms/touched-error';
import { OfferFormGroup } from './offer-form-group';

export interface OfferFormErrors extends OfferFieldErrors {
  readonly placeId: string | null;
  readonly categoryName: string | null;
}

/** The shared messages plus the two fields only the admin form has. */
export function buildOfferFormErrors(form: OfferFormGroup): OfferFormErrors {
  return {
    ...buildOfferFieldErrors(form),
    placeId: touchedError(form.controls.placeId, 'اختر المتجر أو الشركة المقدمة للعرض'),
    categoryName: touchedError(form.controls.categoryName, 'اختر الصنف الرئيسي'),
  };
}
