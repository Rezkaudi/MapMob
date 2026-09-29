import { buildStoreProfile } from '../testing/store-profile-fixture';
import { FormBuilder } from '@angular/forms';
import { closeDay } from './working-week-editing';
import { createStoreProfileFormGroup } from './store-profile-form-group';
import {
  fillStoreProfileForm,
  toStoreProfileFormValue,
  toStoreProfileUpdate,
} from './store-profile-form-mapping';

describe('store profile form mapping', () => {
  it('fills the form from the saved place, with empty text for missing values', () => {
    const profile = buildStoreProfile({
      description: null,
      contact: { ...buildStoreProfile().contact, email: null, instagram: null },
    });

    expect(toStoreProfileFormValue(profile)).toEqual({
      name: 'صيدلية الحياة',
      description: '',
      phone: '+963 944 123 456',
      email: '',
      whatsapp: '+963 944 123 456',
      facebook: 'https://facebook.com/alhayatpharmacy',
      instagram: '',
      telegram: 'https://t.me/alhayatpharmacy',
      address: 'شارع الثورة، بجانب المركز الثقافي، بناء رقم 12',
      latitude: 34.8959,
      longitude: 35.8866,
      isOpen24Hours: false,
      workingHours: profile.workingHours,
      deliveryLinks: [
        {
          platformId: '1',
          isEnabled: true,
          storeUrl: 'https://beeorder.sy/store/alhayat-pharma',
        },
        { platformId: '3', isEnabled: false, storeUrl: '' },
      ],
    });
  });

  it('trims the text, sends null for an empty field and no hours on a closed day', () => {
    const value = {
      ...toStoreProfileFormValue(buildStoreProfile()),
      name: '  صيدلية الحياة ',
      email: '   ',
      instagram: '',
      workingHours: closeDay(buildStoreProfile().workingHours, 'sunday'),
    };
    const cover = new File(['x'], 'cover.jpg', { type: 'image/jpeg' });

    const update = toStoreProfileUpdate(value, cover);

    expect(update.name).toBe('صيدلية الحياة');
    expect(update.email).toBeNull();
    expect(update.instagram).toBeNull();
    expect(update.telegram).toBe('https://t.me/alhayatpharmacy');
    expect(update.cover).toBe(cover);
    expect(update.deliveryLinks).toEqual([
      { platformId: '1', isEnabled: true, storeUrl: 'https://beeorder.sy/store/alhayat-pharma' },
      { platformId: '3', isEnabled: false, storeUrl: null },
    ]);
    expect(update.workingHours.find((day) => day.day === 'sunday')).toEqual({
      day: 'sunday',
      isOpen: false,
      openTime: null,
      closeTime: null,
    });
  });

  it('fills the form with one link group per platform, even after a longer list', () => {
    const form = createStoreProfileFormGroup(new FormBuilder());
    const profile = buildStoreProfile();

    fillStoreProfileForm(form, {
      ...profile,
      deliveryLinks: [...profile.deliveryLinks, ...profile.deliveryLinks],
    });
    fillStoreProfileForm(form, profile);

    expect(form.controls.deliveryLinks.length).toBe(2);
    expect(form.getRawValue()).toEqual(toStoreProfileFormValue(profile));
    expect(form.pristine).toBe(true);
  });
});
