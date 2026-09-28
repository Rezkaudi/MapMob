import { ApiEndpoint } from '../../models/api-endpoint';
import {
  NOTIFICATION_ALERTS,
  PAYMENT_METHOD,
  PLATFORM_GENERAL_FORM,
  PLATFORM_SETTINGS,
} from '../examples/settings-examples';
import { ACTIVATION_STATUS, field, optionalField } from '../shared-fields';

const ALERT_KINDS =
  'new-complaint | place-awaiting-approval | review-reported | subscription-expiring | new-payment';

const PAYMENT_METHOD_FIELDS = [
  field('name', 'string', 'Max 60.'),
  field('kind', 'enum: manual | electronic'),
  field('status', ACTIVATION_STATUS),
];

/** The alerts, payment methods and platform tabs. */
export const SETTINGS_PLATFORM_ENDPOINTS: readonly ApiEndpoint[] = [
  {
    id: 'settings-alerts-list',
    method: 'GET',
    path: '/settings/notifications',
    summary: 'Which events raise an inbox alert for the signed-in admin.',
    permission: null,
    response: {
      status: 200,
      description: 'Always all five rows.',
      example: NOTIFICATION_ALERTS,
      fields: [field('kind', `enum: ${ALERT_KINDS}`, 'kebab-case.'), field('isEnabled', 'boolean')],
    },
  },
  {
    id: 'settings-alerts-save',
    method: 'PUT',
    path: '/settings/notifications/{kind}',
    summary: 'Turn one alert on or off.',
    permission: null,
    pathParams: [field('kind', `enum: ${ALERT_KINDS}`)],
    samplePath: '/settings/notifications/new-complaint',
    body: {
      contentType: 'application/json',
      fields: [field('isEnabled', 'boolean')],
      example: { isEnabled: false },
    },
    response: {
      status: 200,
      description: 'The updated row.',
      example: { kind: 'new-complaint', isEnabled: false },
    },
  },
  {
    id: 'settings-payment-methods-list',
    method: 'GET',
    path: '/settings/payment-methods',
    summary: 'The payment methods the platform takes.',
    permission: 'system:view',
    response: {
      status: 200,
      description: 'Every method. Not paged.',
      example: [PAYMENT_METHOD],
      fields: PAYMENT_METHOD_FIELDS,
    },
  },
  {
    id: 'settings-payment-methods-create',
    method: 'POST',
    path: '/settings/payment-methods',
    summary: 'Add a payment method.',
    permission: 'system:add',
    body: {
      contentType: 'application/json',
      fields: PAYMENT_METHOD_FIELDS,
      example: { name: 'نقداً', kind: 'manual', status: 'active' },
    },
    response: { status: 201, description: 'The new method.', example: PAYMENT_METHOD },
  },
  {
    id: 'settings-payment-methods-update',
    method: 'PUT',
    path: '/settings/payment-methods/{id}',
    summary: 'Update a payment method.',
    permission: 'system:edit',
    body: {
      contentType: 'application/json',
      fields: PAYMENT_METHOD_FIELDS,
      example: { name: 'نقداً', kind: 'manual', status: 'suspended' },
    },
    response: {
      status: 200,
      description: 'The updated method.',
      example: { ...PAYMENT_METHOD, status: 'suspended' },
    },
    notes: ['There is no delete: a method is suspended instead.'],
  },
  {
    id: 'settings-platform-read',
    method: 'GET',
    path: '/settings/platform',
    summary: 'All platform settings, in four groups.',
    permission: 'system:view',
    response: {
      status: 200,
      description: 'One read; each group saves on its own below.',
      example: PLATFORM_SETTINGS,
      fields: [
        field('general', 'object', '{ appName, logoUrl | null, supportEmail, supportPhone }'),
        field('map', 'object', '{ distanceUnit: kilometer | mile, searchRadiusKm }'),
        field('language', 'object', '{ defaultLanguage: ar | en, detectsDeviceLanguage }'),
        field(
          'currency',
          'object',
          '{ currency: SYP | USD, currencySymbol, decimalPlaces: 0 | 1 | 2 }',
        ),
      ],
    },
  },
  {
    id: 'settings-platform-general',
    method: 'PUT',
    path: '/settings/platform/general',
    summary: 'Save the general group.',
    permission: 'system:edit',
    body: {
      contentType: 'multipart/form-data',
      fields: [
        field('appName', 'string'),
        field('supportEmail', 'string (email)'),
        field('supportPhone', 'string'),
        optionalField('logo', 'file (png, svg; max 1 MB)', 'Left out = keep the current logo.'),
      ],
      example: PLATFORM_GENERAL_FORM,
    },
    response: {
      status: 200,
      description: 'The saved group, with the new logoUrl.',
      example: PLATFORM_SETTINGS.general,
    },
  },
  {
    id: 'settings-platform-map',
    method: 'PUT',
    path: '/settings/platform/map',
    summary: 'Save the map group.',
    permission: 'system:edit',
    body: {
      contentType: 'application/json',
      fields: [
        field('distanceUnit', 'enum: kilometer | mile'),
        field('searchRadiusKm', 'number', '1 to 100. Always kilometres.'),
      ],
      example: PLATFORM_SETTINGS.map,
    },
    response: { status: 200, description: 'The saved group.', example: PLATFORM_SETTINGS.map },
  },
  {
    id: 'settings-platform-language',
    method: 'PUT',
    path: '/settings/platform/language',
    summary: 'Save the language group.',
    permission: 'system:edit',
    body: {
      contentType: 'application/json',
      fields: [
        field('defaultLanguage', 'enum: ar | en'),
        field('detectsDeviceLanguage', 'boolean'),
      ],
      example: PLATFORM_SETTINGS.language,
    },
    response: { status: 200, description: 'The saved group.', example: PLATFORM_SETTINGS.language },
  },
  {
    id: 'settings-platform-currency',
    method: 'PUT',
    path: '/settings/platform/currency',
    summary: 'Save the currency group.',
    permission: 'system:edit',
    body: {
      contentType: 'application/json',
      fields: [
        field('currency', 'enum: SYP | USD'),
        field('currencySymbol', 'string', 'Shown next to amounts.'),
        field('decimalPlaces', 'integer: 0 | 1 | 2'),
      ],
      example: PLATFORM_SETTINGS.currency,
    },
    response: { status: 200, description: 'The saved group.', example: PLATFORM_SETTINGS.currency },
  },
];
