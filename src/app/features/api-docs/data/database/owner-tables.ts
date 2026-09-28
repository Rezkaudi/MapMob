import { DbDomain } from '../../models/db-domain';
import { ACTIVATION_STATUS_COLUMN, ID, TIMESTAMPS, foreignKey } from './db-columns';

export const OWNER_DOMAIN: DbDomain = {
  id: 'db-owner',
  name: 'Place owners',
  description:
    'The accounts place owners use for their own dashboard, their password resets and their activity feed. Separate from admins and app users.',
  layout: [['place_owner_accounts', 'owner_password_resets'], ['owner_inbox_items']],
  tables: [
    {
      name: 'place_owner_accounts',
      description: 'One sign-in per place, created by an admin when the place is approved.',
      servedAs: 'POST /owner/auth/login',
      columns: [
        ID,
        { ...foreignKey('place_id', 'places.id', 'One account per place.'), key: 'uq' },
        { name: 'name', type: 'varchar(100)' },
        { name: 'email', type: 'varchar(191)', key: 'uq' },
        { name: 'password', type: 'varchar(255)', note: 'bcrypt.' },
        { name: 'avatar_path', type: 'varchar(255)', isNullable: true },
        ACTIVATION_STATUS_COLUMN,
        { name: 'last_sign_in_at', type: 'timestamp', isNullable: true },
        ...TIMESTAMPS,
      ],
    },
    {
      name: 'owner_password_resets',
      description: 'The emailed 6-digit code and, once checked, the one-time reset token.',
      servedAs: '/owner/auth/password/*',
      columns: [
        ID,
        foreignKey('account_id', 'place_owner_accounts.id', 'Cascade on delete.'),
        { name: 'code_hash', type: 'varchar(255)', note: 'bcrypt of the 6 digits.' },
        { name: 'failed_attempts', type: 'tinyint unsigned', note: 'The code is burnt at 5.' },
        { name: 'code_expires_at', type: 'timestamp', note: '10 minutes after sending.' },
        {
          name: 'reset_token_hash',
          type: 'varchar(255)',
          isNullable: true,
          note: 'Set by verify-code; valid 15 minutes.',
        },
        { name: 'used_at', type: 'timestamp', isNullable: true },
        { name: 'created_at', type: 'timestamp' },
      ],
      indexes: ['INDEX (account_id, created_at)'],
    },
    {
      name: 'owner_inbox_items',
      description:
        'Events worth telling the owner about: subscription changes, reviews, offer decisions, platform news.',
      servedAs: 'GET /owner/notifications, and activities on /owner/overview',
      columns: [
        ID,
        foreignKey('place_id', 'places.id'),
        {
          name: 'category',
          type: "enum('subscriptions','reviews','offers','system')",
          note: 'The overview serves reviews as kind review, offers as offer, the rest as alert.',
        },
        { name: 'title', type: 'varchar(150)', note: 'Arabic, shown as is. The overview message.' },
        { name: 'body', type: 'varchar(500)', note: 'Arabic, shown as is.' },
        {
          name: 'subject_id',
          type: 'bigint unsigned',
          isNullable: true,
          note: 'offers.id or reviews.id, by category; null otherwise.',
        },
        { name: 'read_at', type: 'timestamp', isNullable: true, note: 'Served as isRead.' },
        { name: 'created_at', type: 'timestamp', note: 'Served as receivedAt / occurredAt.' },
      ],
      indexes: ['INDEX (place_id, created_at)'],
    },
  ],
};
