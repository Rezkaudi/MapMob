import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { buildAdFormErrors } from './ad-form-errors';
import { createAdFormGroup } from './ad-form-group';

function createForm() {
  const form = createAdFormGroup(TestBed.inject(FormBuilder));
  return form;
}

function fillValid(form: ReturnType<typeof createForm>): void {
  form.patchValue({
    title: 'حملة الصيف',
    placeId: 'place-3',
    startsOn: '2026-10-15',
    endsOn: '2026-10-30',
  });
}

describe('createAdFormGroup', () => {
  it('starts as an active image ad of a store, on the home page top banner, at the top priority', () => {
    expect(createForm().getRawValue()).toEqual({
      title: '',
      advertiserType: 'place',
      placeId: '',
      contentType: 'image',
      text: '',
      placement: 'home',
      position: 'topBanner',
      startsOn: null,
      endsOn: null,
      isOngoing: false,
      priority: 5,
      status: 'active',
    });
  });

  it('is valid once the title, the store and both days are set', () => {
    const form = createForm();
    fillValid(form);

    expect(form.valid).toBe(true);
  });

  it('needs a store only for a store ad', () => {
    const form = createForm();
    fillValid(form);
    form.controls.placeId.setValue('');

    expect(form.hasError('placeRequired')).toBe(true);
    form.controls.advertiserType.setValue('admin');
    expect(form.valid).toBe(true);
  });

  it('needs a last day on or after the first, unless the ad never ends', () => {
    const form = createForm();
    fillValid(form);

    form.controls.endsOn.setValue('2026-10-01');
    expect(form.hasError('periodOrder')).toBe(true);
    form.controls.endsOn.setValue(null);
    expect(form.hasError('endDayRequired')).toBe(true);
    form.controls.isOngoing.setValue(true);
    expect(form.valid).toBe(true);
  });
});

describe('buildAdFormErrors', () => {
  it('explains each missing or wrong field once the form was submitted', () => {
    const form = createForm();
    form.markAllAsTouched();

    expect(buildAdFormErrors(form)).toEqual({
      title: 'اكتب عنوان الإعلان',
      placeId: 'اختر الشركة أو المتجر التابع للإعلان',
      startsOn: 'اختر تاريخ بدء الإعلان',
      endsOn: 'اختر تاريخ انتهاء الإعلان أو اجعله دائماً',
    });

    form.patchValue({ startsOn: '2026-10-15', endsOn: '2026-10-01' });
    expect(buildAdFormErrors(form).endsOn).toBe(
      'يجب أن يكون تاريخ الانتهاء بعد تاريخ البدء أو في يومه',
    );
  });

  it('says nothing before the admin touches the form', () => {
    expect(Object.values(buildAdFormErrors(createForm())).every((error) => error === null)).toBe(
      true,
    );
  });
});
