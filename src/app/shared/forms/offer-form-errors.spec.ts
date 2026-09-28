import { createOfferFieldsFormGroup } from './offer-form-controls';
import { buildOfferFieldErrors } from './offer-form-errors';

describe('buildOfferFieldErrors', () => {
  it('says nothing about fields nobody has touched', () => {
    const errors = buildOfferFieldErrors(createOfferFieldsFormGroup());

    expect(Object.values(errors).every((error) => error === null)).toBe(true);
  });

  it('explains each missing or wrong field once the form was submitted', () => {
    const form = createOfferFieldsFormGroup();
    form.controls.scope.setValue('selectedItems');
    form.controls.startsOn.setValue('2026-09-10');
    form.controls.endsOn.setValue('2026-09-01');
    form.markAllAsTouched();

    expect(buildOfferFieldErrors(form)).toEqual({
      title: 'اكتب اسم العرض',
      discountPercent: 'اكتب قيمة خصم من 1 إلى 100',
      period: 'يجب أن يكون تاريخ الانتهاء بعد تاريخ البداية أو في يومها',
      itemIds: 'اختر منتجاً أو خدمة واحدة على الأقل',
    });
  });

  it('asks for both days while one is missing', () => {
    const form = createOfferFieldsFormGroup();
    form.markAllAsTouched();

    expect(buildOfferFieldErrors(form).period).toBe('اختر تاريخ بداية العرض وتاريخ انتهائه');
  });
});
