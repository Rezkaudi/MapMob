import { buildStoreProfile } from '../testing/store-profile-fixture';
import { toStoreProfileFormValue, toStoreProfileUpdate } from '../state/store-profile-form-mapping';
import { toStoreProfileFormData } from './store-profile-form-data';

describe('toStoreProfileFormData', () => {
  const buildUpdate = (cover: File | null = null) =>
    toStoreProfileUpdate(toStoreProfileFormValue(buildStoreProfile()), cover);

  it('sends a PUT through POST, with the Arabic text and the map point', () => {
    const data = toStoreProfileFormData(buildUpdate());

    expect(data.get('_method')).toBe('PUT');
    expect(data.get('name[ar]')).toBe('صيدلية الحياة');
    expect(data.get('description[ar]')).toBe('صيدلية تقدم الأدوية والمستلزمات الطبية.');
    expect(data.get('address[ar]')).toBe('شارع الثورة، بجانب المركز الثقافي، بناء رقم 12');
    expect(data.get('phone')).toBe('+963 944 123 456');
    expect(data.get('email')).toBe('contact@alhayat-pharmacy.sy');
    expect(data.get('whatsapp')).toBe('+963 944 123 456');
    expect(data.get('latitude')).toBe('34.8959');
    expect(data.get('longitude')).toBe('35.8866');
  });

  it('sends the social pages as a list of platform and link', () => {
    const data = toStoreProfileFormData(buildUpdate());

    expect(data.get('socialLinks[0][platform]')).toBe('facebook');
    expect(data.get('socialLinks[0][url]')).toBe('https://facebook.com/alhayatpharmacy');
    expect(data.get('socialLinks[1][platform]')).toBe('instagram');
    expect(data.get('socialLinks[2][platform]')).toBe('telegram');
    expect(data.get('socialLinks[2][url]')).toBe('https://t.me/alhayatpharmacy');
  });

  it('sends the seven days numbered from Sunday, as 1 and 0', () => {
    const data = toStoreProfileFormData(buildUpdate());

    expect(data.get('workingHours[0][day]')).toBe('6');
    expect(data.get('workingHours[0][isOpen]')).toBe('1');
    expect(data.get('workingHours[0][openTime]')).toBe('09:00');
    expect(data.get('workingHours[0][closeTime]')).toBe('23:00');
    expect(data.get('workingHours[6][day]')).toBe('5');
    expect(data.get('workingHours[6][isOpen]')).toBe('0');
    expect(data.has('workingHours[6][openTime]')).toBe(false);
    expect(data.has('workingHours[7][day]')).toBe(false);
  });

  it('opens every day from 00:00 to 23:59 when the place never closes', () => {
    const data = toStoreProfileFormData({ ...buildUpdate(), isOpen24Hours: true });

    expect(data.get('workingHours[6][isOpen]')).toBe('1');
    expect(data.get('workingHours[6][openTime]')).toBe('00:00');
    expect(data.get('workingHours[6][closeTime]')).toBe('23:59');
  });

  it('sends only the platforms that have a link', () => {
    const data = toStoreProfileFormData(buildUpdate());

    expect(data.get('deliveryLinks[0][platformId]')).toBe('1');
    expect(data.get('deliveryLinks[0][isEnabled]')).toBe('1');
    expect(data.get('deliveryLinks[0][url]')).toBe('https://beeorder.sy/store/alhayat-pharma');
    expect(data.has('deliveryLinks[1][platformId]')).toBe(false);
  });

  it('leaves out an empty field and a cover that was not changed', () => {
    const update = { ...buildUpdate(), email: null, instagram: null };

    const data = toStoreProfileFormData(update);

    expect(data.has('email')).toBe(false);
    expect(data.get('socialLinks[1][platform]')).toBe('telegram');
    expect(data.has('coverImage')).toBe(false);
  });

  it('sends a newly picked cover as coverImage', () => {
    const cover = new File(['x'], 'new-cover.jpg', { type: 'image/jpeg' });

    const data = toStoreProfileFormData(buildUpdate(cover));

    expect((data.get('coverImage') as File).name).toBe('new-cover.jpg');
  });
});
