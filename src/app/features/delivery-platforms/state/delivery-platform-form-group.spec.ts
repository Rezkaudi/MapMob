import { buildDeliveryPlatformDraft } from '../testing/delivery-platform-fixture';
import {
  createDeliveryPlatformFormGroup,
  readDeliveryPlatformFields,
} from './delivery-platform-form-group';

const SUGGESTED_SORT_ORDER = 8;

describe('createDeliveryPlatformFormGroup', () => {
  it('starts a new platform empty and switched on', () => {
    const form = createDeliveryPlatformFormGroup(null);

    expect(form.getRawValue()).toEqual({
      name: '',
      latinName: '',
      websiteUrl: '',
      status: 'active',
      sortOrder: '',
    });
    expect(form.valid).toBe(false);
  });

  it('fills the fields from a saved platform', () => {
    const form = createDeliveryPlatformFormGroup(buildDeliveryPlatformDraft({ sortOrder: 3 }));

    expect(form.getRawValue()).toEqual({
      name: 'طلبات',
      latinName: 'talabat',
      websiteUrl: 'https://www.talabat.com',
      status: 'active',
      sortOrder: '3',
    });
    expect(form.valid).toBe(true);
  });

  it('wants Latin letters in the English name', () => {
    const form = createDeliveryPlatformFormGroup(buildDeliveryPlatformDraft());

    form.controls.latinName.setValue('طلبات');

    expect(form.controls.latinName.hasError('pattern')).toBe(true);
  });

  it('wants a full web address', () => {
    const form = createDeliveryPlatformFormGroup(buildDeliveryPlatformDraft());

    form.controls.websiteUrl.setValue('talabat.com');

    expect(form.controls.websiteUrl.hasError('pattern')).toBe(true);
  });

  it('takes a whole display position from 1', () => {
    const form = createDeliveryPlatformFormGroup(buildDeliveryPlatformDraft());

    form.controls.sortOrder.setValue('0');
    expect(form.controls.sortOrder.valid).toBe(false);
    form.controls.sortOrder.setValue('2.5');
    expect(form.controls.sortOrder.valid).toBe(false);
    form.controls.sortOrder.setValue('');
    expect(form.controls.sortOrder.valid).toBe(true);
  });
});

describe('readDeliveryPlatformFields', () => {
  it('trims the text and reads the position as a number', () => {
    const form = createDeliveryPlatformFormGroup(null);
    form.setValue({
      name: ' طلبات ',
      latinName: ' talabat ',
      websiteUrl: ' https://www.talabat.com ',
      status: 'suspended',
      sortOrder: '4',
    });

    expect(readDeliveryPlatformFields(form, SUGGESTED_SORT_ORDER)).toEqual({
      name: 'طلبات',
      latinName: 'talabat',
      websiteUrl: 'https://www.talabat.com',
      status: 'suspended',
      sortOrder: 4,
    });
  });

  it('places a platform with no position at the suggested one', () => {
    const form = createDeliveryPlatformFormGroup(buildDeliveryPlatformDraft());
    form.controls.sortOrder.setValue('');

    expect(readDeliveryPlatformFields(form, SUGGESTED_SORT_ORDER).sortOrder).toBe(8);
  });
});
