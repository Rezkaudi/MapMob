import { ApiFeature } from '../../models/api-feature';
import {
  DELIVERY_PLATFORM_FORM,
  DELIVERY_PLATFORM_PAGE,
  DELIVERY_PLATFORM_ROW,
  DELIVERY_PLATFORM_SUMMARY,
  DELIVERY_PLATFORM_UPDATE_FORM,
  LINKED_STORES,
} from '../examples/delivery-platform-examples';
import {
  ACTIVATION_STATUS,
  NO_CONTENT,
  PAGED_ENVELOPE_FIELDS,
  PAGED_QUERY_FIELDS,
  STATUS_BODY_FIELDS,
  field,
  optionalField,
} from '../shared-fields';

const LINKED =
  'A place counts as linked when its place_delivery_links row has is_enabled true and a store_url.';

const PLATFORM_FIELDS = [
  field('id', 'string'),
  field('name', 'string', 'Arabic name, e.g. طلبات.'),
  field('latinName', 'string', 'e.g. talabat. The table shows this one.'),
  field('logoUrl', 'string (url) | null'),
  field('websiteUrl', 'string (url)', 'The public site, shown as "رابط المنصة العامة".'),
  field('linkedStoreCount', 'integer', `Places linked to this platform. ${LINKED}`),
  field(
    'referralCount',
    'integer',
    'Rows in delivery_referrals for this platform: app users sent from a place page to it.',
  ),
  field('status', ACTIVATION_STATUS, 'suspended hides the platform from the owner and the app.'),
  field('sortOrder', 'integer', '1 or more. Lower is listed first in the app and the owner area.'),
  field('createdAt', 'datetime (ISO 8601)', 'Shown as "تاريخ الإضافة".'),
];

const PLATFORM_FORM_FIELDS = [
  field('name', 'string', 'Max 60. Arabic name.'),
  field(
    'latinName',
    'string',
    "Max 60. Latin letters, digits, space . & ' -. Unique, case-insensitive.",
  ),
  field('websiteUrl', 'string (url)', 'Max 255. Starts with http:// or https://.'),
  field('status', ACTIVATION_STATUS),
  field(
    'sortOrder',
    'integer',
    'The dashboard suggests platformCount + 1 from the summary. Ties are listed by name.',
  ),
  optionalField('logo', 'file', 'JPG or PNG, max 5 MB. Sent only when a new logo is picked.'),
  optionalField(
    'removeLogo',
    'boolean',
    'true when the form has no logo: drops the saved one on update. Never sent together with logo.',
  ),
];

const DUPLICATE_NAME = {
  status: 409,
  when: 'Another platform already has this latinName.',
  example: { message: 'A platform with this name already exists.' },
};

export const DELIVERY_PLATFORMS_FEATURE: ApiFeature = {
  id: 'delivery-platforms',
  name: 'Delivery platforms',
  app: 'admin',
  screen: '/admin/delivery-platforms',
  permissionModule: 'places',
  intro:
    'The ordering apps (delivery_platforms) that places link to from their page, such as Talabat or BeeOrder. Admins add, edit, switch off and delete them; owners then fill in their store link per platform on /owner/place.',
  endpoints: [
    {
      id: 'delivery-platforms-list',
      method: 'GET',
      path: '/delivery-platforms',
      summary: 'The paged platform table, four rows a page.',
      queryParams: [...PAGED_QUERY_FIELDS],
      response: {
        status: 200,
        description: 'One page.',
        example: DELIVERY_PLATFORM_PAGE,
        fields: [
          ...PAGED_ENVELOPE_FIELDS,
          ...PLATFORM_FIELDS.map((one) => ({ ...one, name: `items[].${one.name}` })),
        ],
      },
      notes: [
        'search matches name or latinName. With no sort, order by sortOrder, then name.',
        'newest / oldest sort by createdAt.',
      ],
    },
    {
      id: 'delivery-platforms-summary',
      method: 'GET',
      path: '/delivery-platforms/summary',
      summary: 'The four cards above the table.',
      response: {
        status: 200,
        description: 'Counted over every platform, whatever the table filters.',
        example: DELIVERY_PLATFORM_SUMMARY,
        fields: [
          field('referralCount', 'integer', 'All rows in delivery_referrals.'),
          field(
            'mostUsedPlatform',
            'object | null',
            '{ id, name, latinName } of the platform with the most referrals; null when there are none. The card shows latinName.',
          ),
          field('linkedStoreCount', 'integer', `Distinct places linked to any platform. ${LINKED}`),
          field('activeCount', 'integer', 'Platforms with status active.'),
          field('platformCount', 'integer', 'Every platform, active or suspended.'),
        ],
      },
    },
    {
      id: 'delivery-platforms-create',
      method: 'POST',
      path: '/delivery-platforms',
      summary: 'Add a platform from the "إضافة منصة طلبات جديدة" dialog.',
      body: {
        contentType: 'multipart/form-data',
        fields: PLATFORM_FORM_FIELDS,
        example: DELIVERY_PLATFORM_FORM,
      },
      response: {
        status: 201,
        description: 'The new platform, as a table row (both counts 0).',
        example: { ...DELIVERY_PLATFORM_ROW, linkedStoreCount: 0, referralCount: 0 },
      },
      errors: [DUPLICATE_NAME],
      notes: [
        'An active new platform shows up at once on /owner/place, with isEnabled false for every place.',
      ],
    },
    {
      id: 'delivery-platforms-update',
      method: 'PUT',
      path: '/delivery-platforms/{id}',
      summary: 'Save the edit dialog.',
      body: {
        contentType: 'multipart/form-data',
        fields: PLATFORM_FORM_FIELDS,
        example: DELIVERY_PLATFORM_UPDATE_FORM,
      },
      response: { status: 200, description: 'The saved platform.', example: DELIVERY_PLATFORM_ROW },
      errors: [DUPLICATE_NAME],
    },
    {
      id: 'delivery-platforms-status',
      method: 'PATCH',
      path: '/delivery-platforms/{id}/status',
      summary: 'Switch a platform on or off from the row menu ("تغيير الحالة").',
      body: {
        contentType: 'application/json',
        fields: STATUS_BODY_FIELDS,
        example: { status: 'suspended' },
      },
      response: {
        status: 200,
        description: 'The updated platform.',
        example: { ...DELIVERY_PLATFORM_ROW, status: 'suspended' },
      },
      notes: [
        'suspended keeps every place_delivery_links row, so switching it back on restores the links.',
      ],
    },
    {
      id: 'delivery-platforms-delete',
      method: 'DELETE',
      path: '/delivery-platforms/{id}',
      summary: 'Delete a platform from the row menu.',
      response: NO_CONTENT,
      notes: [
        'Also deletes its place_delivery_links and delivery_referrals rows, so the summary drops its referrals.',
      ],
    },
    {
      id: 'delivery-platforms-stores',
      method: 'GET',
      path: '/delivery-platforms/{id}/stores',
      summary: 'The places linked to one platform, for the "عرض المتاجر المرتبطة" dialog.',
      response: {
        status: 200,
        description: `Not paged: the dialog searches and filters by category itself. ${LINKED} Newest link first.`,
        example: LINKED_STORES,
        fields: [
          field('[].id / name', 'string', 'The place.'),
          field('[].logoUrl', 'string (url) | null'),
          field('[].category', 'object', '{ id, name } of the main category.'),
          field('[].governorate', 'object', '{ id, name }.'),
          field('[].area', 'object | null', '{ id, name }.'),
          field('[].storeUrl', 'string (url)', 'place_delivery_links.store_url.'),
          field('[].linkedAt', 'datetime (ISO 8601)', 'place_delivery_links.created_at.'),
        ],
      },
      errors: [
        {
          status: 404,
          when: 'The platform does not exist.',
          example: { message: 'Delivery platform not found.' },
        },
      ],
    },
  ],
};
