import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { DESCRIPTION_MAX_LENGTH, createStoreProfileFormGroup } from './store-profile-form-group';

describe('createStoreProfileFormGroup', () => {
  const createForm = () => createStoreProfileFormGroup(TestBed.inject(FormBuilder));

  it('needs a name, a description, a main phone and an address', () => {
    const form = createForm();

    expect(form.controls.name.hasError('required')).toBe(true);
    expect(form.controls.description.hasError('required')).toBe(true);
    expect(form.controls.phone.hasError('required')).toBe(true);
    expect(form.controls.address.hasError('required')).toBe(true);
    expect(form.controls.email.valid).toBe(true);
    expect(form.controls.telegram.valid).toBe(true);
  });

  it('caps the description at 300 characters, as its counter says', () => {
    const form = createForm();
    form.controls.description.setValue('ا'.repeat(DESCRIPTION_MAX_LENGTH + 1));

    expect(DESCRIPTION_MAX_LENGTH).toBe(300);
    expect(form.controls.description.hasError('maxlength')).toBe(true);
  });

  it('rejects a phone, an email or a page link that cannot be used', () => {
    const form = createForm();
    form.patchValue({
      phone: 'اتصل بنا',
      whatsapp: 'abc',
      email: 'contact@pharmacy',
      facebook: 'facebook.com/alhayat',
      instagram: 'instagram',
      telegram: 't.me',
    });

    for (const name of [
      'phone',
      'whatsapp',
      'email',
      'facebook',
      'instagram',
      'telegram',
    ] as const) {
      expect(form.controls[name].hasError('pattern')).toBe(true);
    }
  });
});
