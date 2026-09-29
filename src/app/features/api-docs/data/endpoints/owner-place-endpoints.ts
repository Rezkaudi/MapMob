import { ApiFeature } from '../../models/api-feature';
import { OWNER_PLACE, OWNER_PLACE_UPDATE_FORM } from '../examples/owner-examples';
import { field, optionalField } from '../shared-fields';

const OWNER_ONLY = 'The owner of the signed-in account; scoped to their own place.';
const DAY_NAMES = 'saturday | sunday | monday | tuesday | wednesday | thursday | friday';
const REF = '{ id, name }';

export const OWNER_PLACE_FEATURE: ApiFeature = {
  id: 'owner-place',
  name: 'Place owner details',
  screen: '/merchant/store',
  permissionModule: null,
  intro:
    'The owner keeps their own place up to date: cover picture, name, description, contact channels, ordering apps, address, map pin and working hours. Categories, governorate and area stay with the admins and are only shown.',
  endpoints: [
    {
      id: 'owner-place-read',
      method: 'GET',
      path: '/owner/place',
      summary: "The signed-in owner's place, as the details screen shows it.",
      permission: OWNER_ONLY,
      response: {
        status: 200,
        description: 'One object for the whole screen.',
        example: OWNER_PLACE,
        fields: [
          field('name', 'string'),
          field('description', 'string | null'),
          field(
            'coverImageUrl',
            'string (url) | null',
            'places.cover_path; null draws an empty frame.',
          ),
          field('mainCategory', 'object', `${REF}. Read-only for the owner.`),
          field('subCategory', 'object | null', `${REF}. Read-only for the owner.`),
          field('contact.phone', 'string', 'The public phone.'),
          field(
            'contact.email / contact.whatsapp / contact.facebook / contact.instagram / contact.telegram',
            'string | null',
            'null when unset. The three pages are full https URLs.',
          ),
          field(
            'location.governorate / location.area',
            'object',
            `${REF}. Read-only for the owner.`,
          ),
          field('location.address', 'string'),
          field('location.latitude / location.longitude', 'number'),
          field(
            'isOpen24Hours',
            'boolean',
            'Shown as "مفتوح 24 ساعة"; open days then have no hours.',
          ),
          field(
            'workingHours',
            'object[]',
            `Always 7 rows, Saturday first: { day: ${DAY_NAMES}, isOpen, openTime | null, closeTime | null } (HH:mm).`,
          ),
          field(
            'deliveryLinks',
            'object[]',
            'One row for every active delivery_platforms row, by sort_order, even if the place never set it up (then isEnabled false, storeUrl null).',
          ),
          field('deliveryLinks[].platform', 'object', '{ id, name, latinName, logoUrl | null }.'),
          field('deliveryLinks[].isEnabled', 'boolean', 'Shown to app users only when true.'),
          field(
            'deliveryLinks[].storeUrl',
            'string (url) | null',
            "The place's page on that app. Kept while switched off.",
          ),
        ],
      },
    },
    {
      id: 'owner-place-update',
      method: 'PUT',
      path: '/owner/place',
      summary: 'Save the details screen in one request.',
      permission: OWNER_ONLY,
      body: {
        contentType: 'multipart/form-data',
        fields: [
          field('name', 'string', 'Max 150.'),
          field('description', 'string', 'Max 300, as the counter on the screen.'),
          field('phone', 'string', 'Digits with an optional leading +, spaces or dashes.'),
          optionalField('email', 'string (email)'),
          optionalField('whatsapp', 'string', 'Same shape as phone.'),
          optionalField('facebook / instagram / telegram', 'string (url)', 'Full https URLs.'),
          field('address', 'string', 'Max 255.'),
          field('latitude', 'number', '-90 to 90. From the map pin.'),
          field('longitude', 'number', '-180 to 180.'),
          field('isOpen24Hours', 'boolean'),
          field(
            'workingHours[n][day] / [isOpen]',
            `${DAY_NAMES} / boolean`,
            'All 7 days, n = 0 (Saturday) … 6 (Friday).',
          ),
          optionalField(
            'workingHours[n][openTime] / [closeTime]',
            'string (HH:mm)',
            'Sent only for an open day. closeTime may be earlier than openTime for a night past midnight.',
          ),
          field(
            'deliveryLinks[n][platformId] / [isEnabled]',
            'string / boolean',
            'Every platform from GET, n = 0, 1, … in the same order.',
          ),
          optionalField(
            'deliveryLinks[n][storeUrl]',
            'string (url)',
            'Full https URL. Required when isEnabled is true; left out when empty.',
          ),
          optionalField(
            'cover',
            'file (JPG or PNG, max 5 MB)',
            'Sent only when a new cover was picked.',
          ),
        ],
        example: OWNER_PLACE_UPDATE_FORM,
      },
      response: {
        status: 200,
        description: 'The saved place, shaped like GET /owner/place.',
        example: OWNER_PLACE,
      },
      notes: [
        'The screen always sends the whole form: an optional text field that is left out is cleared to null.',
        'Answer 422 when a switched-on platform has no storeUrl, or when platformId is not an active platform.',
        'Ignore any category, governorate or area field in the body; only an admin changes those, through PUT /places/{id}.',
        'PHP does not read multipart bodies on PUT. Parse the body yourself (for example in a middleware).',
      ],
    },
  ],
};
