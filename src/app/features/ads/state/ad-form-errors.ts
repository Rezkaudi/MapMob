import { AdFormGroup } from './ad-form-group';

export interface AdFormErrors {
  readonly title: string | null;
  readonly placeId: string | null;
  readonly startsOn: string | null;
  readonly endsOn: string | null;
}

const MESSAGES = {
  title: 'اكتب عنوان الإعلان',
  placeId: 'اختر الشركة أو المتجر التابع للإعلان',
  startsOn: 'اختر تاريخ بدء الإعلان',
  endDayRequired: 'اختر تاريخ انتهاء الإعلان أو اجعله دائماً',
  periodOrder: 'يجب أن يكون تاريخ الانتهاء بعد تاريخ البدء أو في يومه',
};

function endDayError(form: AdFormGroup): string | null {
  if (!form.controls.endsOn.touched) {
    return null;
  }
  if (form.hasError('endDayRequired')) {
    return MESSAGES.endDayRequired;
  }
  return form.hasError('periodOrder') ? MESSAGES.periodOrder : null;
}

/** The message under each field, shown only once the admin has been there or pressed save. */
export function buildAdFormErrors(form: AdFormGroup): AdFormErrors {
  const { title, placeId, startsOn } = form.controls;
  return {
    title: title.touched && title.invalid ? MESSAGES.title : null,
    placeId: placeId.touched && form.hasError('placeRequired') ? MESSAGES.placeId : null,
    startsOn: startsOn.touched && startsOn.invalid ? MESSAGES.startsOn : null,
    endsOn: endDayError(form),
  };
}
