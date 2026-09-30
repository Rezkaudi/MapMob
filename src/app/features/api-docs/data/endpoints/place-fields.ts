import { PLAN_TIER, field, optionalField } from '../shared-fields';
import { DELIVERY_LINK_FIELDS, DELIVERY_LINK_WRITE_FIELDS } from './delivery-link-fields';

export const PLACE_STATUS = 'enum: active | suspended | pending';
const DAY_NAMES = 'saturday | sunday | monday | tuesday | wednesday | thursday | friday';
const REF = '{ id, name }';

export const PLACE_ROW_FIELDS = [
  field('id', 'string'),
  field('code', 'string', 'Human reference such as PL-0012. Unique, made by the server.'),
  field('name', 'string'),
  field(
    'publicUrl',
    'string (url)',
    'The public page of the place, https://mapmob.app/store/{places.slug}. The QR card and the row QR dialog encode it.',
  ),
  field(
    'logoUrl',
    'string (url) | null',
    'null when there is no logo; the dashboard draws a placeholder.',
  ),
  field('category', 'object', `${REF} of the main category.`),
  field('governorate', 'object', REF),
  field('rating', 'number', 'Average of rated reviews, one decimal. 0 with none.'),
  field('reviewCount', 'integer'),
  field('status', PLACE_STATUS),
  field('planTier', PLAN_TIER, 'Tier of the current subscription.'),
  field('createdAt', 'datetime (ISO 8601)', 'When the place was added.'),
];

export const PLACE_DETAIL_FIELDS = [
  field(
    'id / code / name / publicUrl / status / logoUrl / rating / reviewCount',
    '',
    'As in the list row.',
  ),
  field('description', 'string | null'),
  field('mainCategory', 'object', REF),
  field('subCategory', 'object | null', REF),
  field('isOpenNow', 'boolean', 'From the working hours, in Damascus time.'),
  field('owner', 'object', '{ name | null, phone, extraPhone | null }'),
  field(
    'contact',
    'object',
    'phone, and extraPhone / website / whatsapp / facebook / instagram / telegram, each null when unset.',
  ),
  field('location', 'object', `{ governorate ${REF}, area ${REF}, address, latitude, longitude }`),
  field(
    'workingHours',
    'object[]',
    `Always 7 rows, Saturday first: { day: ${DAY_NAMES}, isOpen, openTime | null, closeTime | null } (HH:mm).`,
  ),
  field(
    'subscription',
    'object | null',
    `{ plan { id, name, tier }, status: active | paused | expired, startsOn, endsOn }. null before the first one.`,
  ),
  field('images', 'object[]', '{ id, url } in display order.'),
  field('videos', 'object[]', '{ id, url, posterUrl, durationSeconds }'),
  field(
    'products',
    'object[]',
    '{ id, name, price, currency: SYP | USD, imageUrl | null, isAvailable, orderUrl | null }',
  ),
  field(
    'offers',
    'object[]',
    "The place's offers: { id, title, description, startsOn, endsOn, status, imageUrl | null }. Same status words as /offers.",
  ),
  ...DELIVERY_LINK_FIELDS,
  field('createdAt / updatedAt', 'datetime (ISO 8601)'),
];

export const PLACE_WRITE_FIELDS = [
  field('name', 'string', 'Max 150.'),
  optionalField('ownerName', 'string', 'Max 100.'),
  field('ownerPhone', 'string', 'Syrian number, 10 digits starting 09, e.g. 0931234567.'),
  optionalField('ownerExtraPhone', 'string'),
  field('mainCategoryId', 'string', 'An active main category.'),
  optionalField('subCategoryId', 'string', 'Must be a child of mainCategoryId.'),
  field('governorateId', 'string'),
  field('areaId', 'string', 'Must belong to governorateId.'),
  field('address', 'string', 'Max 255.'),
  field('latitude', 'number', '-90 to 90. From the map pin.'),
  field('longitude', 'number', '-180 to 180.'),
  field('phone', 'string', 'The public phone.'),
  optionalField('extraPhone / whatsapp', 'string'),
  optionalField('website / facebook / instagram / telegram', 'string (url)', 'Full https URLs.'),
  optionalField('description', 'string', 'Max 2000.'),
  field(
    'planId',
    'string',
    'Sets the current subscription plan. Money is recorded separately with POST /payments.',
  ),
  field('status', PLACE_STATUS, 'A new place is usually pending.'),
  field('workingHours[n][day]', `enum: ${DAY_NAMES}`, 'Exactly 7 rows, each day once.'),
  field('workingHours[n][isOpen]', 'boolean'),
  optionalField(
    'workingHours[n][openTime] / [closeTime]',
    'string (HH:mm)',
    'Required when isOpen is true; closeTime after openTime.',
  ),
  ...DELIVERY_LINK_WRITE_FIELDS,
  optionalField('logo', 'file (png, jpg, webp; max 2 MB)'),
  optionalField(
    'images[]',
    'file[] (png, jpg, webp; max 5 MB each)',
    'Plan limit on the total: free 3, basic 30, featured 100.',
  ),
  optionalField(
    'videos[]',
    'file[] (mp4; max 50 MB each)',
    'Plan limit on the total: free 1, basic 5, featured 20.',
  ),
  optionalField(
    'products[n][name]',
    'string',
    'Plan limit: free 3, basic 10, featured 50 products.',
  ),
  optionalField('products[n][price]', 'number', '0 or more.'),
  optionalField('products[n][currency]', 'enum: SYP | USD'),
  optionalField('products[n][isAvailable]', 'boolean', 'Default true.'),
  optionalField('products[n][orderUrl]', 'string (url)', 'Link to an outside ordering app.'),
  optionalField('products[n][image]', 'file (png, jpg, webp; max 2 MB)'),
];
