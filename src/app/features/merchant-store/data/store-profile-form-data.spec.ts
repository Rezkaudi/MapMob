import { buildStoreProfile } from '../testing/store-profile-fixture';
import { toStoreProfileFormValue, toStoreProfileUpdate } from '../state/store-profile-form-mapping';
import { toStoreProfileFormData } from './store-profile-form-data';

describe('toStoreProfileFormData', () => {
  const buildUpdate = (cover: File | null = null) =>
    toStoreProfileUpdate(toStoreProfileFormValue(buildStoreProfile()), cover);

  it('sends the text fields, the map point and the 24-hour switch', () => {
    const data = toStoreProfileFormData(buildUpdate());

    expect(data.get('name')).toBe('صيدلية الحياة');
    expect(data.get('description')).toBe('صيدلية تقدم الأدوية والمستلزمات الطبية.');
    expect(data.get('phone')).toBe('+963 944 123 456');
    expect(data.get('email')).toBe('contact@alhayat-pharmacy.sy');
    expect(data.get('whatsapp')).toBe('+963 944 123 456');
    expect(data.get('facebook')).toBe('https://facebook.com/alhayatpharmacy');
    expect(data.get('instagram')).toBe('https://instagram.com/alhayatpharmacy');
    expect(data.get('telegram')).toBe('https://t.me/alhayatpharmacy');
    expect(data.get('address')).toBe('شارع الثورة، بجانب المركز الثقافي، بناء رقم 12');
    expect(data.get('latitude')).toBe('34.8959');
    expect(data.get('longitude')).toBe('35.8866');
    expect(data.get('isOpen24Hours')).toBe('false');
  });

  it('sends the seven days, with hours only on the open ones', () => {
    const data = toStoreProfileFormData(buildUpdate());

    expect(data.get('workingHours[0][day]')).toBe('saturday');
    expect(data.get('workingHours[0][isOpen]')).toBe('true');
    expect(data.get('workingHours[0][openTime]')).toBe('09:00');
    expect(data.get('workingHours[0][closeTime]')).toBe('23:00');
    expect(data.get('workingHours[6][day]')).toBe('friday');
    expect(data.get('workingHours[6][isOpen]')).toBe('false');
    expect(data.has('workingHours[6][openTime]')).toBe(false);
    expect(data.has('workingHours[7][day]')).toBe(false);
  });

  it('sends every platform, with a link only where one is set', () => {
    const data = toStoreProfileFormData(buildUpdate());

    expect(data.get('deliveryLinks[0][platformId]')).toBe('1');
    expect(data.get('deliveryLinks[0][isEnabled]')).toBe('true');
    expect(data.get('deliveryLinks[0][storeUrl]')).toBe('https://beeorder.sy/store/alhayat-pharma');
    expect(data.get('deliveryLinks[1][platformId]')).toBe('3');
    expect(data.get('deliveryLinks[1][isEnabled]')).toBe('false');
    expect(data.has('deliveryLinks[1][storeUrl]')).toBe(false);
  });

  it('leaves out an empty field and a cover that was not changed', () => {
    const update = { ...buildUpdate(), email: null, instagram: null };

    const data = toStoreProfileFormData(update);

    expect(data.has('email')).toBe(false);
    expect(data.has('instagram')).toBe(false);
    expect(data.has('cover')).toBe(false);
  });

  it('sends a newly picked cover', () => {
    const cover = new File(['x'], 'new-cover.jpg', { type: 'image/jpeg' });

    const data = toStoreProfileFormData(buildUpdate(cover));

    expect((data.get('cover') as File).name).toBe('new-cover.jpg');
  });
});
