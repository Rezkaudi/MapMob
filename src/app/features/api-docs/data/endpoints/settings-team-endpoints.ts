import { ApiEndpoint } from '../../models/api-endpoint';
import {
  ACCOUNT_PROFILE,
  ADMIN_INVITATION,
  ADMIN_ROLE,
  DASHBOARD_ADMIN,
  PASSWORD_CHANGE,
  ROLE_DRAFT,
} from '../examples/settings-examples';
import { ACTIVATION_STATUS, NO_CONTENT, field } from '../shared-fields';

const PERMISSION_MODULES =
  'home, places, categories, regions, users, reviews, offers, subscriptions, payments, reports, complaints, notifications, content, system';

const ROLE_DRAFT_FIELDS = [
  field('name', 'string', 'Max 60. Unique.'),
  field('description', 'string'),
  field(
    'status',
    'enum: active | suspended',
    'A suspended role grants nothing until turned back on.',
  ),
  field('grants', 'string[]', 'Every ticked "module:action". Replaces the whole list.'),
];

/** The account, the admin team and the roles tabs. */
export const SETTINGS_TEAM_ENDPOINTS: readonly ApiEndpoint[] = [
  {
    id: 'settings-account-read',
    method: 'GET',
    path: '/settings/account',
    summary: "The signed-in admin's own profile.",
    permission: null,
    response: {
      status: 200,
      description: 'The profile.',
      example: ACCOUNT_PROFILE,
      fields: [
        field('fullName / email', 'string'),
        field('roleName', 'string', 'Shown as a badge. Not editable here.'),
      ],
    },
  },
  {
    id: 'settings-account-save',
    method: 'PUT',
    path: '/settings/account',
    summary: "Change the signed-in admin's name and email.",
    permission: null,
    body: {
      contentType: 'application/json',
      fields: [
        field('fullName', 'string', 'Max 100.'),
        field('email', 'string (email)', 'Unique among admins.'),
      ],
      example: { fullName: ACCOUNT_PROFILE.fullName, email: ACCOUNT_PROFILE.email },
    },
    response: { status: 200, description: 'The updated profile.', example: ACCOUNT_PROFILE },
  },
  {
    id: 'settings-account-password',
    method: 'PUT',
    path: '/settings/account/password',
    summary: "Change the signed-in admin's password.",
    permission: null,
    body: {
      contentType: 'application/json',
      fields: [
        field('currentPassword', 'string', 'Checked on the server.'),
        field('newPassword', 'string', 'At least 8 characters.'),
      ],
      example: PASSWORD_CHANGE,
    },
    response: NO_CONTENT,
    notes: [
      'A wrong currentPassword is a 422 with the error on "currentPassword", so the form shows it under that input.',
      "Revoke the admin's other tokens.",
    ],
  },
  {
    id: 'settings-admins-list',
    method: 'GET',
    path: '/settings/admins',
    summary: 'The admin team.',
    permission: 'system:view',
    response: {
      status: 200,
      description: 'Every admin. Not paged.',
      example: [DASHBOARD_ADMIN],
      fields: [
        field('roleId / roleName', 'string'),
        field('status', ACTIVATION_STATUS),
        field('lastSignInAt', 'datetime (ISO 8601) | null', 'null until the first sign-in.'),
      ],
    },
  },
  {
    id: 'settings-admins-invite',
    method: 'POST',
    path: '/settings/admins',
    summary: 'Invite a new admin.',
    permission: 'system:add',
    body: {
      contentType: 'application/json',
      fields: [
        field('fullName', 'string'),
        field('email', 'string (email)', 'Unique.'),
        field('roleId', 'string'),
      ],
      example: ADMIN_INVITATION,
    },
    response: { status: 201, description: 'The new admin row.', example: DASHBOARD_ADMIN },
    notes: [
      'No password is sent. Email a one-time link where the new admin sets their own password.',
    ],
  },
  {
    id: 'settings-roles-list',
    method: 'GET',
    path: '/settings/roles',
    summary: 'The roles with their permission grants.',
    permission: 'system:view',
    response: {
      status: 200,
      description: 'Every role. Not paged.',
      example: [ADMIN_ROLE],
      fields: [
        field(
          'grants',
          'string[]',
          `"module:action". Modules: ${PERMISSION_MODULES}. Actions: view, add, edit, delete.`,
        ),
        field(
          'isFullAccess',
          'boolean',
          'The owner role: every permission whatever grants says. Cannot be edited or deleted.',
        ),
        field('icon', 'enum: shield | headset'),
        field('adminCount', 'integer', 'Admins holding this role.'),
      ],
    },
  },
  {
    id: 'settings-roles-create',
    method: 'POST',
    path: '/settings/roles',
    summary: 'Create a role.',
    permission: 'system:add',
    body: { contentType: 'application/json', fields: ROLE_DRAFT_FIELDS, example: ROLE_DRAFT },
    response: { status: 201, description: 'The new role.', example: ADMIN_ROLE },
    notes: [
      'englishName, icon, isFullAccess and adminCount are not sent. Default them (icon "shield", isFullAccess false). Every grant must be a module:action pair the matrix offers.',
    ],
  },
  {
    id: 'settings-roles-update',
    method: 'PUT',
    path: '/settings/roles/{id}',
    summary: 'Update a role.',
    permission: 'system:edit',
    body: { contentType: 'application/json', fields: ROLE_DRAFT_FIELDS, example: ROLE_DRAFT },
    response: { status: 200, description: 'The updated role.', example: ADMIN_ROLE },
    errors: [
      {
        status: 409,
        when: 'The role is the full-access role.',
        example: { message: 'The owner role cannot be changed.' },
      },
    ],
  },
  {
    id: 'settings-roles-delete',
    method: 'DELETE',
    path: '/settings/roles/{id}',
    summary: 'Delete a role.',
    permission: 'system:delete',
    response: NO_CONTENT,
    errors: [
      {
        status: 409,
        when: 'Admins still hold the role, or it is the full-access role.',
        example: { message: '3 admins still hold this role.' },
      },
    ],
  },
];
