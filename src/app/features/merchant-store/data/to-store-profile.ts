import { arabicTextOf } from '../../../shared/data/arabic-text-of';
import { DeliveryLink } from '../../../shared/models/delivery-link';
import { StoreProfile } from '../models/store-profile';
import { StoreWorkingDay } from '../models/store-working-day';
import { ALL_DAY_CLOSE_TIME, ALL_DAY_OPEN_TIME } from './all-day-hours';
import { LiveOwnerDeliveryLink } from './live-owner-delivery-link';
import { LiveOwnerSocialLink } from './live-owner-social-link';
import { LiveOwnerStore } from './live-owner-store';
import { LIVE_WEEK_DAYS, PAGE_WEEK_DAYS } from './live-week-day';
import { SocialPlatform } from './social-platforms';

export function toStoreProfile(store: LiveOwnerStore): StoreProfile {
  const workingHours = toWorkingWeek(store);
  return {
    name: arabicTextOf(store.name) ?? '',
    publicUrl: store.publicUrl,
    description: arabicTextOf(store.description),
    coverImageUrl: store.coverImageUrl,
    mainCategory: store.mainCategory,
    subCategory: store.subCategory,
    contact: {
      phone: store.contact.phone ?? '',
      email: store.contact.email,
      whatsapp: store.contact.whatsapp,
      facebook: socialUrlOf(store.socialLinks, 'facebook'),
      instagram: socialUrlOf(store.socialLinks, 'instagram'),
      telegram: socialUrlOf(store.socialLinks, 'telegram'),
    },
    location: {
      governorate: store.region,
      area: store.city,
      address: arabicTextOf(store.address) ?? '',
      latitude: store.latitude,
      longitude: store.longitude,
    },
    isOpen24Hours: workingHours.every(isOpenAllDay),
    workingHours,
    deliveryLinks: store.deliveryLinks.map(toDeliveryLink),
  };
}

function toWorkingWeek(store: LiveOwnerStore): StoreWorkingDay[] {
  return PAGE_WEEK_DAYS.map((day) => {
    const live = store.workingHours.find((one) => LIVE_WEEK_DAYS[one.day] === day);
    const isOpen = live?.isOpen ?? false;
    return {
      day,
      isOpen,
      openTime: isOpen ? (live?.openTime ?? null) : null,
      closeTime: isOpen ? (live?.closeTime ?? null) : null,
    };
  });
}

function isOpenAllDay(day: StoreWorkingDay): boolean {
  return day.isOpen && day.openTime === ALL_DAY_OPEN_TIME && day.closeTime === ALL_DAY_CLOSE_TIME;
}

function socialUrlOf(
  links: readonly LiveOwnerSocialLink[],
  platform: SocialPlatform,
): string | null {
  return links.find((link) => link.platform === platform)?.url ?? null;
}

function toDeliveryLink(link: LiveOwnerDeliveryLink): DeliveryLink {
  const platform = link.platform ?? link.deliveryPlatform;
  const platformId = String(platform?.id ?? link.platformId ?? link.deliveryPlatformId ?? '');
  const name = platform?.name ?? '';
  return {
    platform: {
      id: platformId,
      name,
      latinName: name,
      logoUrl: platform?.logoUrl ?? platform?.logo ?? null,
    },
    isEnabled: link.isEnabled ?? link.isActive ?? false,
    storeUrl: link.url ?? link.storeUrl ?? null,
  };
}
