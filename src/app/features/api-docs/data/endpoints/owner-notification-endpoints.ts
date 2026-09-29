import { ApiFeature } from '../../models/api-feature';
import { OWNER_NOTIFICATION } from '../examples/owner-examples';
import { field } from '../shared-fields';

export const OWNER_NOTIFICATIONS_FEATURE: ApiFeature = {
  id: 'owner-notifications',
  name: 'Place owner notifications',
  app: 'owner',
  screen: '/merchant/notifications',
  permissionModule: null,
  intro:
    "The owner's own notifications behind the bell: subscription changes, new reviews, offer decisions and platform news. The screen filters read and unread itself, so the list is not paged.",
  endpoints: [
    {
      id: 'owner-notifications-list',
      method: 'GET',
      path: '/owner/notifications',
      summary: "The owner's notifications, newest first.",
      response: {
        status: 200,
        description: 'The latest 50 owner_inbox_items. Not paged.',
        example: [OWNER_NOTIFICATION],
        fields: [
          field('id', 'string'),
          field(
            'category',
            'enum: subscriptions | reviews | offers | system',
            'Colours the card and picks its link: the subscription page, the reviews page, the offer edit page, or home.',
          ),
          field('title / body', 'string', 'Arabic, shown as is.'),
          field('receivedAt', 'datetime (ISO 8601)', 'Shown as "منذ 10 دقائق".'),
          field('isRead', 'boolean'),
          field(
            'subjectId',
            'string | null',
            'The offer (category offers) or review (category reviews) it is about; null otherwise. An offer id opens that offer for editing.',
          ),
        ],
      },
      notes: [
        'Create a row when an admin changes the subscription, a visitor leaves a review, an admin approves or rejects an offer, and for platform news sent to owners.',
      ],
    },
    {
      id: 'owner-notifications-read',
      method: 'PATCH',
      path: '/owner/notifications/{id}/read',
      summary: 'Mark one notification as read.',
      body: { contentType: 'application/json', fields: [], example: {} },
      response: {
        status: 200,
        description: 'The notification, isRead now true.',
        example: { ...OWNER_NOTIFICATION, isRead: true },
      },
      errors: [
        {
          status: 404,
          when: 'The notification does not exist or belongs to another place.',
          example: { message: 'Notification not found.' },
        },
      ],
      notes: [
        'Sent when the owner presses the blue dot or follows the card link. The dashboard sends {}. Calling it twice is fine.',
      ],
    },
  ],
};
