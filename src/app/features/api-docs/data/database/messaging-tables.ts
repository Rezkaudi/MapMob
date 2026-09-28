import { DbDomain } from '../../models/db-domain';
import { ID, TIMESTAMPS, adminReference, foreignKey } from './db-columns';

export const MESSAGING_DOMAIN: DbDomain = {
  id: 'db-messaging',
  name: 'Push notifications',
  description: 'Notifications admins write for app users or places, and who they go to.',
  layout: [['push_notifications'], ['push_notification_recipients']],
  tables: [
    {
      name: 'push_notifications',
      description: 'One push campaign.',
      servedAs: '/notifications',
      columns: [
        ID,
        { name: 'title', type: 'varchar(60)' },
        { name: 'body', type: 'varchar(250)' },
        { name: 'image_path', type: 'varchar(255)', isNullable: true },
        { name: 'audience', type: "enum('users','places')" },
        {
          name: 'recipient_mode',
          type: "enum('all','selected','location')",
          note: 'kind = general when all, else private.',
        },
        foreignKey('governorate_id', 'governorates.id', 'Only with location.', true),
        foreignKey('area_id', 'areas.id', 'Only with location.', true),
        { name: 'status', type: "enum('draft','scheduled','sent')" },
        {
          name: 'send_at',
          type: 'datetime',
          isNullable: true,
          note: 'Stored in UTC; the API speaks Damascus wall-clock.',
        },
        { name: 'sent_at', type: 'datetime', isNullable: true },
        { name: 'recipient_count', type: 'int unsigned' },
        adminReference('created_by_admin_id', ''),
        ...TIMESTAMPS,
      ],
      indexes: ['INDEX (status, send_at)'],
    },
    {
      name: 'push_notification_recipients',
      description: 'The picked people when recipient_mode is selected.',
      servedAs: 'recipientIds on /notifications/{id}',
      columns: [
        {
          ...foreignKey('notification_id', 'push_notifications.id', 'Cascade on delete.'),
          key: 'pk',
        },
        {
          name: 'recipient_type',
          type: "enum('user','place')",
          key: 'pk',
          note: 'Follows the audience.',
        },
        {
          name: 'recipient_id',
          type: 'bigint unsigned',
          key: 'pk',
          note: 'users.id or places.id.',
        },
      ],
      indexes: ['PRIMARY (notification_id, recipient_type, recipient_id)'],
    },
  ],
};
