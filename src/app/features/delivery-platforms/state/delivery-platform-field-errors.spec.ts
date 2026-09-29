import { createDeliveryPlatformFormGroup } from './delivery-platform-form-group';
import { findDeliveryPlatformFieldErrors } from './delivery-platform-field-errors';

describe('findDeliveryPlatformFieldErrors', () => {
  it('stays quiet until the admin has been through the fields', () => {
    const form = createDeliveryPlatformFormGroup(null);

    expect(Object.values(findDeliveryPlatformFieldErrors(form))).toEqual([null, null, null, null]);
  });

  it('asks for each missing field once they are touched', () => {
    const form = createDeliveryPlatformFormGroup(null);
    form.markAllAsTouched();

    expect(findDeliveryPlatformFieldErrors(form)).toEqual({
      name: 'أدخل اسم المنصة بالعربي',
      latinName: 'أدخل اسم المنصة بالانجليزية',
      websiteUrl: 'أدخل رابط المنصة الرئيسي',
      sortOrder: null,
    });
  });

  it('explains a value of the wrong shape', () => {
    const form = createDeliveryPlatformFormGroup(null);
    form.setValue({
      name: 'طلبات',
      latinName: 'طلبات',
      websiteUrl: 'talabat',
      status: 'active',
      sortOrder: '0',
    });
    form.markAllAsTouched();

    expect(findDeliveryPlatformFieldErrors(form)).toEqual({
      name: null,
      latinName: 'اكتب الاسم بأحرف لاتينية',
      websiteUrl: 'أدخل رابطاً كاملاً يبدأ بـ https://',
      sortOrder: 'أدخل رقماً صحيحاً من 1 فأكثر',
    });
  });
});
