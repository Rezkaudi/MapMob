import { LiveOwnerStore } from './live-owner-store';
import { toStoreProfile } from './to-store-profile';

function buildLiveStore(overrides: Partial<LiveOwnerStore> = {}): LiveOwnerStore {
  return {
    name: { ar: 'صيدلية الحياة', en: 'Alhayat' },
    description: { ar: 'صيدلية', en: 'pharmacy' },
    publicUrl: 'https://api.mapmob.com.co/store/alhayat',
    coverImageUrl: null,
    contact: { phone: '0931', whatsapp: null, email: 'a@b.com', website: null },
    mainCategory: { id: '1', name: 'صيدليات' },
    subCategory: null,
    region: { id: '1', name: 'دمشق' },
    city: { id: '2', name: 'داريا' },
    address: { ar: 'شارع الثورة' },
    latitude: 33.5,
    longitude: 36.3,
    workingHours: [0, 1, 2, 3, 4, 5, 6].map((day) => ({
      day,
      isOpen: day !== 5,
      openTime: day !== 5 ? '09:00' : null,
      closeTime: day !== 5 ? '18:00' : null,
    })),
    socialLinks: [
      { id: '3', platform: 'facebook', url: 'https://facebook.com/a', sortOrder: 0 },
      { id: '4', platform: 'telegram', url: 'https://t.me/a', sortOrder: 1 },
    ],
    deliveryLinks: [],
    ...overrides,
  };
}

describe('toStoreProfile', () => {
  it('reads the Arabic text, the contact list and the place on the map', () => {
    const profile = toStoreProfile(buildLiveStore());

    expect(profile.name).toBe('صيدلية الحياة');
    expect(profile.description).toBe('صيدلية');
    expect(profile.contact).toEqual({
      phone: '0931',
      email: 'a@b.com',
      whatsapp: null,
      facebook: 'https://facebook.com/a',
      instagram: null,
      telegram: 'https://t.me/a',
    });
    expect(profile.location).toEqual({
      governorate: { id: '1', name: 'دمشق' },
      area: { id: '2', name: 'داريا' },
      address: 'شارع الثورة',
      latitude: 33.5,
      longitude: 36.3,
    });
  });

  it('has no description when the server sends an empty list for it', () => {
    expect(toStoreProfile(buildLiveStore({ description: [] })).description).toBeNull();
  });

  it('lists the week from Saturday, turning 0 into Sunday', () => {
    const profile = toStoreProfile(buildLiveStore());

    expect(profile.workingHours.map((day) => day.day)).toEqual([
      'saturday',
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
    ]);
    expect(profile.workingHours[6]).toEqual({
      day: 'friday',
      isOpen: false,
      openTime: null,
      closeTime: null,
    });
    expect(profile.isOpen24Hours).toBe(false);
  });

  it('is open 24 hours when every day runs from 00:00 to 23:59', () => {
    const allDay = [0, 1, 2, 3, 4, 5, 6].map((day) => ({
      day,
      isOpen: true,
      openTime: '00:00',
      closeTime: '23:59',
    }));

    expect(toStoreProfile(buildLiveStore({ workingHours: allDay })).isOpen24Hours).toBe(true);
  });

  it('reads the delivery links the place already has', () => {
    const profile = toStoreProfile(
      buildLiveStore({
        deliveryLinks: [
          {
            platformId: '1',
            platform: { id: '1', name: 'BeeOrder', logo: null },
            isEnabled: true,
            url: 'https://beeorder.sy/store/a',
          },
        ],
      }),
    );

    expect(profile.deliveryLinks).toEqual([
      {
        platform: { id: '1', name: 'BeeOrder', latinName: 'BeeOrder', logoUrl: null },
        isEnabled: true,
        storeUrl: 'https://beeorder.sy/store/a',
      },
    ]);
  });
});
