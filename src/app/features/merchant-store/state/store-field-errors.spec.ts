import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { createStoreProfileFormGroup } from './store-profile-form-group';
import { findStoreFieldError, findStoreFieldErrors } from './store-field-errors';

describe('findStoreFieldError', () => {
  const createForm = () => createStoreProfileFormGroup(TestBed.inject(FormBuilder));

  it('says nothing until the field was visited', () => {
    const form = createForm();

    expect(findStoreFieldError(form, 'name')).toBeNull();
  });

  it('asks for a missing required value', () => {
    const form = createForm();
    form.markAllAsTouched();

    expect(findStoreFieldError(form, 'name')).toBe('أدخل اسم المتجر');
    expect(findStoreFieldError(form, 'description')).toBe('أدخل وصف المتجر');
    expect(findStoreFieldError(form, 'phone')).toBe('أدخل رقم الهاتف الأساسي');
    expect(findStoreFieldError(form, 'address')).toBe('أدخل العنوان التفصيلي');
    expect(findStoreFieldError(form, 'email')).toBeNull();
  });

  it('explains a value in the wrong shape', () => {
    const form = createForm();
    form.patchValue({
      description: 'ا'.repeat(301),
      phone: 'x',
      whatsapp: 'x',
      email: 'x',
      facebook: 'x',
      instagram: 'x',
      telegram: 'x',
    });
    form.markAllAsTouched();

    expect(findStoreFieldError(form, 'description')).toBe('الوصف 300 حرف كحد أقصى');
    expect(findStoreFieldError(form, 'phone')).toBe('أدخل رقم هاتف صحيح');
    expect(findStoreFieldError(form, 'whatsapp')).toBe('أدخل رقم واتساب صحيح');
    expect(findStoreFieldError(form, 'email')).toBe('أدخل بريداً إلكترونياً صحيحاً');
    expect(findStoreFieldError(form, 'facebook')).toBe('أدخل رابطاً كاملاً يبدأ بـ https://');
    expect(findStoreFieldError(form, 'instagram')).toBe('أدخل رابطاً كاملاً يبدأ بـ https://');
    expect(findStoreFieldError(form, 'telegram')).toBe('أدخل رابطاً كاملاً يبدأ بـ https://');
  });
  it('collects the message of every field at once', () => {
    const form = createForm();
    form.markAllAsTouched();

    const errors = findStoreFieldErrors(form);

    expect(errors.name).toBe('أدخل اسم المتجر');
    expect(errors.telegram).toBeNull();
    expect(Object.keys(errors)).toHaveLength(9);
  });
});
