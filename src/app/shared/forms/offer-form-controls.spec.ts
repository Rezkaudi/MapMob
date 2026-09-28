import { createOfferFieldsFormGroup } from './offer-form-controls';

function fillValid(form: ReturnType<typeof createOfferFieldsFormGroup>): void {
  form.setValue({
    title: 'خصم 30% على جميع المنتجات',
    discountPercent: 30,
    startsOn: '2026-09-01',
    endsOn: '2026-09-30',
    status: 'active',
    description: '',
    scope: 'allItems',
    itemIds: [],
  });
}

describe('createOfferFieldsFormGroup', () => {
  it('starts empty, active and covering every item', () => {
    const form = createOfferFieldsFormGroup();

    expect(form.getRawValue()).toMatchObject({ status: 'active', scope: 'allItems', itemIds: [] });
    expect(form.valid).toBe(false);
  });

  it('is valid once every required field is filled', () => {
    const form = createOfferFieldsFormGroup();
    fillValid(form);

    expect(form.valid).toBe(true);
  });

  it('needs a discount from 1 to 100 and a title with letters in it', () => {
    const form = createOfferFieldsFormGroup();
    fillValid(form);

    form.controls.discountPercent.setValue(101);
    expect(form.valid).toBe(false);
    form.controls.discountPercent.setValue(30);
    form.controls.title.setValue('   ');
    expect(form.valid).toBe(false);
  });

  it('needs the last day on or after the first, and an item when only picked items count', () => {
    const form = createOfferFieldsFormGroup();
    fillValid(form);

    form.controls.endsOn.setValue('2026-08-31');
    expect(form.hasError('periodOrder')).toBe(true);

    form.controls.endsOn.setValue('2026-09-30');
    form.controls.scope.setValue('selectedItems');
    expect(form.hasError('itemsRequired')).toBe(true);
  });
});
