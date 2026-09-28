import { ApiFeature } from '../../models/api-feature';
import {
  AUDIENCE_ESTIMATE,
  NOTIFICATION_DETAIL,
  NOTIFICATION_FORM,
  NOTIFICATION_FORM_OPTIONS,
  NOTIFICATION_RECIPIENTS,
  NOTIFICATION_ROW,
  NOTIFICATION_SUMMARY,
} from '../examples/notification-examples';
import {
  EMPTY_BODY_NOTE,
  NO_CONTENT,
  PAGED_QUERY_FIELDS,
  dayRangeFields,
  field,
  optionalField,
  pagedExample,
} from '../shared-fields';

const AUDIENCE = 'enum: users | places';
const SEND_TIME = 'datetime (ISO 8601 with offset)';
const SEND_TIME_NOTE =
  'e.g. 2026-10-01T20:00:00+03:00 (Damascus). Store in UTC; return with the Damascus offset.';

const NOTIFICATION_FORM_FIELDS = [
  field('title', 'string', 'Max 60.'),
  field('body', 'string', 'Max 250.'),
  field('audience', AUDIENCE),
  field('recipientMode', 'enum: all | selected | location'),
  optionalField('governorateId', 'string', 'Only with recipientMode location.'),
  optionalField('areaId', 'string', 'Optional even then: left out = the whole governorate.'),
  optionalField(
    'recipientIds[]',
    'string[] (repeated field)',
    'Only with recipientMode selected. User or place ids by audience.',
  ),
  optionalField('sendAt', SEND_TIME, `Left out = send now. ${SEND_TIME_NOTE}`),
  field(
    'intent',
    'enum: publish | draft',
    'draft saves only. publish sends now, or schedules when sendAt is set.',
  ),
  optionalField('image', 'file (png, jpg; max 2 MB)'),
  field('isImageRemoved', 'boolean'),
];

const ALREADY_SENT = {
  status: 409,
  when: 'The notification was already sent.',
  example: { message: 'A sent notification cannot be changed.' },
};

export const NOTIFICATIONS_FEATURE: ApiFeature = {
  id: 'notifications',
  name: 'Push notifications',
  screen: '/notifications',
  permissionModule: 'notifications',
  intro:
    'Push notifications for app users or places: target everyone, a location or picked recipients; send now or schedule; duplicate, reschedule and resend.',
  endpoints: [
    {
      id: 'notifications-list',
      method: 'GET',
      path: '/notifications',
      summary: 'The paged notifications table.',
      queryParams: [
        ...PAGED_QUERY_FIELDS,
        optionalField('audience', AUDIENCE),
        optionalField('kind', 'enum: general | private'),
        optionalField('status', 'enum: sent | scheduled | draft'),
        ...dayRangeFields('sentFrom', 'sentTo', 'of sendAt'),
      ],
      response: {
        status: 200,
        description: 'One page.',
        example: pagedExample([NOTIFICATION_ROW], 74),
        fields: [
          field('audience', AUDIENCE),
          field('recipientMode', 'enum: all | selected | location'),
          field(
            'kind',
            'enum: general | private',
            'Worked out: general when recipientMode is all, else private.',
          ),
          field('status', 'enum: sent | scheduled | draft'),
          field(
            'sendAt',
            `${SEND_TIME} | null`,
            `${SEND_TIME_NOTE} null for a draft with no time.`,
          ),
          field('recipientCount', 'integer', 'Devices reached (sent) or expected (scheduled).'),
        ],
      },
    },
    {
      id: 'notifications-summary',
      method: 'GET',
      path: '/notifications/summary',
      summary: 'The four cards above the table.',
      response: {
        status: 200,
        description: 'Counts over the whole table.',
        example: NOTIFICATION_SUMMARY,
      },
    },
    {
      id: 'notifications-detail',
      method: 'GET',
      path: '/notifications/{id}',
      summary: 'One notification with what the edit form needs.',
      response: {
        status: 200,
        description: 'The row fields at the top level, plus the targeting.',
        example: NOTIFICATION_DETAIL,
        fields: [
          field('imageUrl', 'string (url) | null'),
          field('governorateId / areaId', 'string | null', 'Only with recipientMode location.'),
          field('recipientIds', 'string[]', '[] unless recipientMode is selected.'),
        ],
      },
    },
    {
      id: 'notifications-create',
      method: 'POST',
      path: '/notifications',
      summary: 'Create a notification: send now, schedule, or save a draft.',
      body: {
        contentType: 'multipart/form-data',
        fields: NOTIFICATION_FORM_FIELDS,
        example: NOTIFICATION_FORM,
      },
      response: {
        status: 201,
        description: 'The new row with status draft, scheduled or sent.',
        example: NOTIFICATION_ROW,
      },
      notes: ['Send through a queue (for example FCM) so the request returns at once.'],
    },
    {
      id: 'notifications-update',
      method: 'PUT',
      path: '/notifications/{id}',
      summary: 'Update a notification that was not sent yet.',
      body: {
        contentType: 'multipart/form-data',
        fields: NOTIFICATION_FORM_FIELDS,
        example: NOTIFICATION_FORM,
      },
      response: { status: 200, description: 'The updated row.', example: NOTIFICATION_ROW },
      errors: [ALREADY_SENT],
    },
    {
      id: 'notifications-delete',
      method: 'DELETE',
      path: '/notifications/{id}',
      summary: 'Delete a notification. A scheduled one is cancelled.',
      response: NO_CONTENT,
    },
    {
      id: 'notifications-duplicate',
      method: 'POST',
      path: '/notifications/{id}/duplicate',
      summary: 'Copy a notification into a new draft.',
      response: {
        status: 201,
        description: 'The copy: same content and targeting, status draft, sendAt null.',
        example: { ...NOTIFICATION_ROW, id: 'n75', status: 'draft', sendAt: null },
      },
      notes: [EMPTY_BODY_NOTE],
    },
    {
      id: 'notifications-reschedule',
      method: 'POST',
      path: '/notifications/{id}/reschedule',
      summary: 'Move a scheduled notification to another time.',
      permission: 'notifications:edit',
      body: {
        contentType: 'application/json',
        fields: [field('sendAt', SEND_TIME, 'Must be in the future.')],
        example: { sendAt: '2026-10-02T09:30:00+03:00' },
      },
      response: {
        status: 200,
        description: 'The updated row.',
        example: { ...NOTIFICATION_ROW, sendAt: '2026-10-02T09:30:00+03:00' },
      },
      errors: [
        {
          status: 409,
          when: 'The notification is not scheduled.',
          example: { message: 'Only a scheduled notification can be moved.' },
        },
      ],
    },
    {
      id: 'notifications-resend',
      method: 'POST',
      path: '/notifications/{id}/resend',
      summary: 'Send a sent notification again, now or later.',
      permission: 'notifications:edit',
      body: {
        contentType: 'application/json',
        fields: [field('sendAt', `${SEND_TIME} | null`, 'The key is always sent. null = now.')],
        example: { sendAt: null },
      },
      response: {
        status: 200,
        description: 'The row that will be sent.',
        example: { ...NOTIFICATION_ROW, status: 'sent', sendAt: '2026-09-28T11:05:00+03:00' },
      },
    },
    {
      id: 'notifications-form-options',
      method: 'GET',
      path: '/notifications/form-options',
      summary: 'Governorates with their areas, for location targeting.',
      response: {
        status: 200,
        description: 'Active governorates and areas.',
        example: NOTIFICATION_FORM_OPTIONS,
      },
    },
    {
      id: 'notifications-recipients',
      method: 'GET',
      path: '/notifications/recipients',
      summary: 'Search users or places to pick one by one.',
      queryParams: [
        field('audience', AUDIENCE),
        field('search', 'string', 'Typed text. "" for a first list.'),
      ],
      response: {
        status: 200,
        description: 'At most 20 matches. Fast: this is a type-ahead.',
        example: NOTIFICATION_RECIPIENTS,
        fields: [field('id / name / phone / city', 'string')],
      },
    },
    {
      id: 'notifications-audience-estimate',
      method: 'GET',
      path: '/notifications/audience-estimate',
      summary: 'How many devices a location send would reach, shown live.',
      queryParams: [
        field('audience', AUDIENCE),
        field('governorateId', 'string'),
        optionalField('areaId', 'string', 'Left out for the whole governorate.'),
      ],
      response: {
        status: 200,
        description: 'The estimate.',
        example: AUDIENCE_ESTIMATE,
        fields: [
          field('deviceCount', 'integer', 'Active devices with a push token.'),
          field(
            'sharePercent',
            'number 0-100',
            'A PERCENTAGE of all devices of the audience (68.5 = 68.5%).',
          ),
        ],
      },
    },
  ],
};
