import { StoreProfile } from '../models/store-profile';
import { StoreProfileUpdate } from '../models/store-profile-update';

/** What the server does on save: owner fields change, the admin-managed ones stay. */
export function applyStoreProfileUpdate(
  saved: StoreProfile,
  update: StoreProfileUpdate,
  uploadedCoverUrl: string | null,
): StoreProfile {
  return {
    ...saved,
    name: update.name,
    description: update.description,
    coverImageUrl: uploadedCoverUrl ?? saved.coverImageUrl,
    contact: {
      phone: update.phone,
      email: update.email,
      whatsapp: update.whatsapp,
      facebook: update.facebook,
      instagram: update.instagram,
      telegram: update.telegram,
    },
    location: {
      ...saved.location,
      address: update.address,
      latitude: update.latitude,
      longitude: update.longitude,
    },
    isOpen24Hours: update.isOpen24Hours,
    workingHours: update.workingHours,
  };
}
