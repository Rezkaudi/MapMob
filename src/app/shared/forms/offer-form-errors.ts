import { OfferFieldsForm } from './offer-fields-form';
import { touchedError } from './touched-error';

export interface OfferFieldErrors {
  readonly title: string | null;
  readonly discountPercent: string | null;
  readonly period: string | null;
  readonly itemIds: string | null;
}

const MESSAGES = {
  title: 'اكتب اسم العرض',
  discountPercent: 'اكتب قيمة خصم من 1 إلى 100',
  periodMissing: 'اختر تاريخ بداية العرض وتاريخ انتهائه',
  periodOrder: 'يجب أن يكون تاريخ الانتهاء بعد تاريخ البداية أو في يومها',
  itemIds: 'اختر منتجاً أو خدمة واحدة على الأقل',
};

function periodError(form: Pick<OfferFieldsForm, 'controls' | 'hasError'>): string | null {
  const { startsOn, endsOn } = form.controls;
  if (!startsOn.touched && !endsOn.touched) {
    return null;
  }
  if (startsOn.invalid || endsOn.invalid) {
    return MESSAGES.periodMissing;
  }
  return form.hasError('periodOrder') ? MESSAGES.periodOrder : null;
}

/** The message under each shared field, shown only once it was visited or save was pressed. */
export function buildOfferFieldErrors(
  form: Pick<OfferFieldsForm, 'controls' | 'hasError'>,
): OfferFieldErrors {
  const { title, discountPercent, itemIds } = form.controls;
  return {
    title: touchedError(title, MESSAGES.title),
    discountPercent: touchedError(discountPercent, MESSAGES.discountPercent),
    period: periodError(form),
    itemIds: itemIds.touched && form.hasError('itemsRequired') ? MESSAGES.itemIds : null,
  };
}
