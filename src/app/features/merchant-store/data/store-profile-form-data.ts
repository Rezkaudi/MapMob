import { StoreProfileUpdate } from '../models/store-profile-update';
import { StoreWorkingDay } from '../models/store-working-day';
import { ALL_DAY_CLOSE_TIME, ALL_DAY_OPEN_TIME } from './all-day-hours';
import { liveDayNumberOf } from './live-week-day';
import { SOCIAL_PLATFORMS } from './social-platforms';

const OPTIONAL_CONTACT_FIELDS = ['email', 'whatsapp'] as const;
const YES = '1';
const NO = '0';

/** POST with `_method=PUT`, as PHP reads no multipart body on a real PUT. Empty fields are left out. */
export function toStoreProfileFormData(update: StoreProfileUpdate): FormData {
  const data = new FormData();
  data.set('_method', 'PUT');
  data.set('name[ar]', update.name);
  if (update.description !== null) {
    data.set('description[ar]', update.description);
  }
  data.set('address[ar]', update.address);
  data.set('phone', update.phone);
  for (const field of OPTIONAL_CONTACT_FIELDS) {
    const value = update[field];
    if (value !== null) {
      data.set(field, value);
    }
  }
  data.set('latitude', String(update.latitude));
  data.set('longitude', String(update.longitude));
  appendSocialLinks(data, update);
  appendWorkingHours(data, update);
  appendDeliveryLinks(data, update);
  if (update.cover) {
    data.set('coverImage', update.cover);
  }
  return data;
}

function appendSocialLinks(data: FormData, update: StoreProfileUpdate): void {
  SOCIAL_PLATFORMS.filter((platform) => update[platform] !== null).forEach((platform, index) => {
    data.set(`socialLinks[${index}][platform]`, platform);
    data.set(`socialLinks[${index}][url]`, update[platform] ?? '');
  });
}

function appendWorkingHours(data: FormData, update: StoreProfileUpdate): void {
  update.workingHours.forEach((workingDay, index) => {
    const day = update.isOpen24Hours ? openAllDay(workingDay) : workingDay;
    const prefix = `workingHours[${index}]`;
    data.set(`${prefix}[day]`, String(liveDayNumberOf(day.day)));
    data.set(`${prefix}[isOpen]`, day.isOpen ? YES : NO);
    if (day.isOpen && day.openTime !== null && day.closeTime !== null) {
      data.set(`${prefix}[openTime]`, day.openTime);
      data.set(`${prefix}[closeTime]`, day.closeTime);
    }
  });
}

function openAllDay(day: StoreWorkingDay): StoreWorkingDay {
  return { ...day, isOpen: true, openTime: ALL_DAY_OPEN_TIME, closeTime: ALL_DAY_CLOSE_TIME };
}

// The server refuses a link with no address, so a platform that was never set up is left out.
function appendDeliveryLinks(data: FormData, update: StoreProfileUpdate): void {
  update.deliveryLinks
    .filter((link) => link.storeUrl !== null)
    .forEach((link, index) => {
      const prefix = `deliveryLinks[${index}]`;
      data.set(`${prefix}[platformId]`, link.platformId);
      data.set(`${prefix}[isEnabled]`, link.isEnabled ? YES : NO);
      data.set(`${prefix}[url]`, link.storeUrl ?? '');
    });
}
