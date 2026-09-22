import { createPlaceDetail } from '../testing/place-detail-fixture';
import { toPlaceFormValue } from './place-form-mapping';

describe('toPlaceFormValue', () => {
  it('fills every field the form shows from the saved place', () => {
    const detail = createPlaceDetail();

    expect(toPlaceFormValue(detail)).toEqual({
      name: detail.name,
      ownerName: detail.owner.name,
      ownerPhone: detail.owner.phone,
      ownerExtraPhone: detail.owner.extraPhone,
      mainCategory: detail.mainCategory,
      subCategory: detail.subCategory,
      city: detail.location.city,
      region: detail.location.region,
      address: detail.location.address,
      latitude: detail.location.latitude,
      longitude: detail.location.longitude,
      phone: detail.contact.phone,
      extraPhone: detail.contact.extraPhone,
      website: detail.contact.website,
      whatsapp: detail.contact.whatsapp,
      useMainPhoneForWhatsapp: true,
      facebook: detail.contact.facebook,
      instagram: detail.contact.instagram,
      telegram: detail.contact.telegram,
      description: detail.description,
      package: detail.subscription.package,
      status: detail.status,
    });
  });

  it('unticks the whatsapp box when whatsapp differs from the main phone', () => {
    const detail = createPlaceDetail({
      contact: {
        phone: '0955111111',
        extraPhone: '',
        website: '',
        whatsapp: '0955222222',
        facebook: '',
        instagram: '',
        telegram: '',
      },
    });

    expect(toPlaceFormValue(detail).useMainPhoneForWhatsapp).toBe(false);
  });
});
