import { ApiFeature } from '../../models/api-feature';
import { INBOX_ITEMS } from '../examples/notification-examples';
import { field } from '../shared-fields';

export const INBOX_FEATURE: ApiFeature = {
  id: 'inbox',
  name: 'Admin inbox',
  screen: '/admin/inbox',
  permissionModule: null,
  intro: "The signed-in admin's own alerts behind the bell in the top bar.",
  endpoints: [
    {
      id: 'inbox-list',
      method: 'GET',
      path: '/inbox',
      summary: "The admin's alerts, newest first.",
      response: {
        status: 200,
        description: 'The latest 50. Not paged.',
        example: INBOX_ITEMS,
        fields: [
          field(
            'category',
            'enum: complaints | subscriptions | offers | system',
            'Colours the card.',
          ),
          field('title / body', 'string'),
          field('receivedAt', 'datetime (ISO 8601)', 'Shown as "منذ 10 دقائق".'),
          field('isRead', 'boolean'),
        ],
      },
      notes: [
        'Only for the signed-in admin. Which events create alerts is set in /settings/notifications.',
      ],
    },
    {
      id: 'inbox-read',
      method: 'PATCH',
      path: '/inbox/{id}/read',
      summary: 'Mark one alert as read.',
      body: { contentType: 'application/json', fields: [], example: {} },
      response: {
        status: 200,
        description: 'The alert, isRead now true.',
        example: { ...INBOX_ITEMS[0], isRead: true },
      },
      notes: ['The dashboard sends {}. Calling it twice is fine.'],
    },
  ],
};
