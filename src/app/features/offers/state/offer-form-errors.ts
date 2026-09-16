import { OfferFormGroup } from './offer-form-group';

export interface OfferFormErrors {
  readonly title: string | null;
  readonly discountPercent: string | null;
  readonly placeId: string | null;
  readonly categoryName: string | null;
  readonly period: string | null;
  readonly itemIds: string | null;
}

const MESSAGES = {
  title: 'اكتب اسم العرض',
  discountPercent: 'اكتب قيمة خصم من 1 إلى 100',
  placeId: 'اختر المتجر أو الشركة المقدمة للعرض',
  categoryName: 'اختر الصنف الرئيسي',
  periodMissing: 'اختر تاريخ بداية العرض وتاريخ انتهائه',
  periodOrder: 'يجب أن يكون تاريخ الانتهاء بعد تاريخ البداية أو في يومها',
  itemIds: 'اختر منتجاً أو خدمة واحدة على الأقل',
};

type SimpleField = 'title' | 'discountPercent' | 'placeId' | 'categoryName';

function fieldError(form: OfferFormGroup, field: SimpleField): string | null {
  const control = form.controls[field];
  return control.touched && control.invalid ? MESSAGES[field] : null;
}

function periodError(form: OfferFormGroup): string | null {
  const { startsOn, endsOn } = form.controls;
  if (!startsOn.touched && !endsOn.touched) {
    return null;
  }
  if (startsOn.invalid || endsOn.invalid) {
    return MESSAGES.periodMissing;
  }
  return form.hasError('periodOrder') ? MESSAGES.periodOrder : null;
}

/** The message under each field, shown only once the admin has been there or pressed save. */
export function buildOfferFormErrors(form: OfferFormGroup): OfferFormErrors {
  return {
    title: fieldError(form, 'title'),
    discountPercent: fieldError(form, 'discountPercent'),
    placeId: fieldError(form, 'placeId'),
    categoryName: fieldError(form, 'categoryName'),
    period: periodError(form),
    itemIds:
      form.controls.itemIds.touched && form.hasError('itemsRequired') ? MESSAGES.itemIds : null,
  };
}
