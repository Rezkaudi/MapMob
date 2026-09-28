import { DbDomain } from '../../models/db-domain';
import { ACTIVATION_STATUS_COLUMN, ID, TIMESTAMPS, foreignKey } from './db-columns';

export const ACCESS_DOMAIN: DbDomain = {
  id: 'db-access',
  name: 'Admins and access',
  description:
    'Dashboard admins, their roles and grants, their alert switches and their inbox. Separate from app users.',
  layout: [
    ['roles', 'role_permissions'],
    ['admins'],
    ['admin_alert_settings', 'admin_inbox_items'],
  ],
  tables: [
    {
      name: 'admins',
      description: 'People who sign in to the dashboard.',
      servedAs: 'POST /auth/login, /settings/account, /settings/admins',
      columns: [
        ID,
        { name: 'full_name', type: 'varchar(100)' },
        { name: 'email', type: 'varchar(191)', key: 'uq' },
        {
          name: 'password',
          type: 'varchar(255)',
          isNullable: true,
          note: 'bcrypt. null until the invite is accepted.',
        },
        foreignKey('role_id', 'roles.id'),
        { name: 'avatar_path', type: 'varchar(255)', isNullable: true },
        ACTIVATION_STATUS_COLUMN,
        { name: 'invited_at', type: 'timestamp', isNullable: true },
        {
          name: 'last_sign_in_at',
          type: 'timestamp',
          isNullable: true,
          note: 'Served as lastSignInOn (yyyy-mm-dd).',
        },
        ...TIMESTAMPS,
      ],
    },
    {
      name: 'roles',
      description: 'Named sets of permissions.',
      servedAs: '/settings/roles',
      columns: [
        ID,
        { name: 'name', type: 'varchar(60)', key: 'uq' },
        { name: 'english_name', type: 'varchar(60)' },
        { name: 'description', type: 'varchar(255)' },
        { name: 'icon', type: "enum('shield','headset')", note: "Default 'shield'." },
        {
          name: 'is_full_access',
          type: 'boolean',
          note: 'The owner role. Exactly one row is true.',
        },
        { name: 'status', type: "enum('active','suspended')" },
        ...TIMESTAMPS,
      ],
    },
    {
      name: 'role_permissions',
      description: 'One row per ticked box of the matrix.',
      servedAs: 'roles[].grants',
      columns: [
        { ...foreignKey('role_id', 'roles.id', 'Cascade on delete.'), key: 'pk' },
        {
          name: 'permission',
          type: 'varchar(40)',
          key: 'pk',
          note: '"module:action", e.g. places:edit.',
        },
      ],
      indexes: ['PRIMARY (role_id, permission)'],
    },
    {
      name: 'admin_alert_settings',
      description: 'Which events raise an inbox alert, per admin. A missing row means enabled.',
      servedAs: '/settings/notifications',
      columns: [
        { ...foreignKey('admin_id', 'admins.id'), key: 'pk' },
        {
          name: 'kind',
          type: "enum('new-complaint','place-awaiting-approval','review-reported','subscription-expiring','new-payment')",
          key: 'pk',
        },
        { name: 'is_enabled', type: 'boolean' },
      ],
      indexes: ['PRIMARY (admin_id, kind)'],
    },
    {
      name: 'admin_inbox_items',
      description: 'Alerts delivered to one admin.',
      servedAs: '/inbox',
      columns: [
        ID,
        foreignKey('admin_id', 'admins.id'),
        { name: 'category', type: "enum('complaints','subscriptions','offers','system')" },
        { name: 'title', type: 'varchar(120)' },
        { name: 'body', type: 'varchar(500)' },
        {
          name: 'read_at',
          type: 'timestamp',
          isNullable: true,
          note: 'Served as isRead = read_at is not null.',
        },
        { name: 'created_at', type: 'timestamp', note: 'Served as receivedAt.' },
      ],
      indexes: ['INDEX (admin_id, created_at)'],
    },
  ],
};
