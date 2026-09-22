import { PlaceDetail } from '../models/place-detail';
import { PlaceFormValue } from './place-form-group';

/** The saved place as the form holds it. */
export function toPlaceFormValue(detail: PlaceDetail): PlaceFormValue {
  const { owner, contact, location, subscription } = detail;
  return {
    name: detail.name,
    ownerName: owner.name,
    ownerPhone: owner.phone,
    ownerExtraPhone: owner.extraPhone,
    mainCategory: detail.mainCategory,
    subCategory: detail.subCategory,
    city: location.city,
    region: location.region,
    address: location.address,
    latitude: location.latitude,
    longitude: location.longitude,
    phone: contact.phone,
    extraPhone: contact.extraPhone,
    website: contact.website,
    whatsapp: contact.whatsapp,
    useMainPhoneForWhatsapp: contact.whatsapp === contact.phone,
    facebook: contact.facebook,
    instagram: contact.instagram,
    telegram: contact.telegram,
    description: detail.description,
    package: subscription.package,
    status: detail.status,
  };
}
