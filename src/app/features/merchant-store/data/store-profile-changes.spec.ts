import { buildStoreProfile } from '../testing/store-profile-fixture';
import { toStoreProfileFormValue, toStoreProfileUpdate } from '../state/store-profile-form-mapping';
import { applyStoreProfileUpdate } from './store-profile-changes';

describe('applyStoreProfileUpdate', () => {
  const saved = buildStoreProfile();
  const buildUpdate = () => toStoreProfileUpdate(toStoreProfileFormValue(saved), null);

  it('writes the owner fields and keeps what only an admin may change', () => {
    const update = {
      ...buildUpdate(),
      name: 'صيدلية الحياة 2',
      email: null,
      address: 'شارع هنانو',
    };

    const result = applyStoreProfileUpdate(saved, update, null);

    expect(result.name).toBe('صيدلية الحياة 2');
    expect(result.contact.email).toBeNull();
    expect(result.location).toEqual({ ...saved.location, address: 'شارع هنانو' });
    expect(result.mainCategory).toEqual(saved.mainCategory);
    expect(result.subCategory).toEqual(saved.subCategory);
  });

  it('switches platforms and sets their links, keeping the platform details', () => {
    const update = {
      ...buildUpdate(),
      deliveryLinks: [
        { platformId: '1', isEnabled: false, storeUrl: 'https://beeorder.sy/store/alhayat-pharma' },
        { platformId: '3', isEnabled: true, storeUrl: 'https://talabat.com/syria/alhayat' },
      ],
    };

    const result = applyStoreProfileUpdate(saved, update, null);

    expect(result.deliveryLinks).toEqual([
      { ...saved.deliveryLinks[0], isEnabled: false },
      {
        platform: saved.deliveryLinks[1].platform,
        isEnabled: true,
        storeUrl: 'https://talabat.com/syria/alhayat',
      },
    ]);
  });

  it('keeps the saved cover unless a new one was uploaded', () => {
    expect(applyStoreProfileUpdate(saved, buildUpdate(), null).coverImageUrl).toBe(
      saved.coverImageUrl,
    );
    expect(applyStoreProfileUpdate(saved, buildUpdate(), 'blob:new').coverImageUrl).toBe(
      'blob:new',
    );
  });
});
