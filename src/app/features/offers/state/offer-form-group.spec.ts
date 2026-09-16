import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { buildOfferFormErrors } from './offer-form-errors';
import { createOfferFormGroup } from './offer-form-group';

function createForm() {
  return createOfferFormGroup(TestBed.inject(FormBuilder));
}

function fillValid(form: ReturnType<typeof createForm>): void {
  form.setValue({
    title: 'خصم 30% على جميع المنتجات',
    discountPercent: 30,
    placeId: 'place-7',
    categoryName: 'ألبسة',
    startsOn: '2026-09-01',
    endsOn: '2026-09-30',
    status: 'active',
    description: '',
    scope: 'allItems',
    itemIds: [],
  });
}

describe('createOfferFormGroup', () => {
  it('starts empty, active and covering every item', () => {
    const form = createForm();

    expect(form.getRawValue()).toMatchObject({ status: 'active', scope: 'allItems', itemIds: [] });
    expect(form.valid).toBe(false);
  });

  it('is valid once every required field is filled', () => {
    const form = createForm();
    fillValid(form);

    expect(form.valid).toBe(true);
  });

  it('needs a discount from 1 to 100', () => {
    const form = createForm();
    fillValid(form);

    form.controls.discountPercent.setValue(0);
    expect(form.valid).toBe(false);
    form.controls.discountPercent.setValue(101);
    expect(form.valid).toBe(false);
  });

  it('needs the last day on or after the first day', () => {
    const form = createForm();
    fillValid(form);

    form.controls.endsOn.setValue('2026-08-31');

    expect(form.hasError('periodOrder')).toBe(true);
  });

  it('needs at least one item when the offer covers picked items only', () => {
    const form = createForm();
    fillValid(form);

    form.controls.scope.setValue('selectedItems');
    expect(form.hasError('itemsRequired')).toBe(true);

    form.controls.itemIds.setValue(['place-7-item-1']);
    expect(form.valid).toBe(true);
  });
});

describe('buildOfferFormErrors', () => {
  it('says nothing about fields the admin has not touched', () => {
    expect(Object.values(buildOfferFormErrors(createForm())).every((error) => error === null)).toBe(
      true,
    );
  });

  it('explains each missing or wrong field once the form was submitted', () => {
    const form = createForm();
    form.controls.scope.setValue('selectedItems');
    form.controls.startsOn.setValue('2026-09-10');
    form.controls.endsOn.setValue('2026-09-01');
    form.markAllAsTouched();

    expect(buildOfferFormErrors(form)).toEqual({
      title: 'اكتب اسم العرض',
      discountPercent: 'اكتب قيمة خصم من 1 إلى 100',
      placeId: 'اختر المتجر أو الشركة المقدمة للعرض',
      categoryName: 'اختر الصنف الرئيسي',
      period: 'يجب أن يكون تاريخ الانتهاء بعد تاريخ البداية أو في يومها',
      itemIds: 'اختر منتجاً أو خدمة واحدة على الأقل',
    });
  });

  it('asks for both days while one is missing', () => {
    const form = createForm();
    form.markAllAsTouched();

    expect(buildOfferFormErrors(form).period).toBe('اختر تاريخ بداية العرض وتاريخ انتهائه');
  });
});
