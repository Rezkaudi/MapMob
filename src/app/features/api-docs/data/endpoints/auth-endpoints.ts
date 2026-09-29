import { ApiFeature } from '../../models/api-feature';
import { CURRENT_ADMIN, SIGN_IN_REQUEST, SIGNED_IN_ADMIN } from '../examples/auth-examples';
import { NO_CONTENT, field } from '../shared-fields';

const ADMIN_FIELDS = [
  field('admin.id / admin.name / admin.email', 'string'),
  field('admin.avatarUrl', 'string (url) | null'),
  field('admin.role', 'object', '{ id, name, isFullAccess }'),
  field(
    'admin.permissions',
    'string[]',
    'Every "module:action" the role grants; all of them when isFullAccess. The dashboard hides what is not granted, the API still checks every call.',
  ),
];

export const AUTH_FEATURE: ApiFeature = {
  id: 'auth',
  name: 'Authentication',
  app: 'admin',
  screen: '/login',
  permissionModule: null,
  intro:
    'Sign in, check the saved token on reload, and sign out. Every other call sends the token as a bearer token.',
  endpoints: [
    {
      id: 'auth-login',
      method: 'POST',
      path: '/auth/login',
      summary: 'Sign an admin in and return a token with who they are and what they may do.',
      isPublic: true,
      body: {
        contentType: 'application/json',
        fields: [
          field('email', 'string (email)'),
          field('password', 'string', 'Plain text, over HTTPS only.'),
        ],
        example: SIGN_IN_REQUEST,
      },
      response: {
        status: 200,
        description: 'The token and the admin.',
        example: SIGNED_IN_ADMIN,
        fields: [
          field('token', 'string', 'Sanctum token. Sent back as "Authorization: Bearer <token>".'),
          field('expiresAt', 'datetime (ISO 8601)', 'When the token stops working (30 days).'),
          ...ADMIN_FIELDS,
        ],
      },
      errors: [
        {
          status: 401,
          when: 'The email or password is wrong, or the admin is suspended. Do not say which.',
          example: { message: 'These credentials do not match our records.' },
        },
        {
          status: 429,
          when: 'Too many attempts: 5 per minute per email and IP.',
          example: { message: 'Too many login attempts. Please try again in 60 seconds.' },
        },
      ],
      notes: ['Stamp admins.last_sign_in_at on success.'],
    },
    {
      id: 'auth-me',
      method: 'GET',
      path: '/auth/me',
      summary: 'The signed-in admin, to check a saved token when the dashboard reloads.',
      permission: null,
      response: {
        status: 200,
        description: "The admin, same shape as login's admin.",
        example: CURRENT_ADMIN,
        fields: ADMIN_FIELDS.map((one) => ({ ...one, name: one.name.replace(/admin\./g, '') })),
      },
    },
    {
      id: 'auth-logout',
      method: 'POST',
      path: '/auth/logout',
      summary: 'Sign out: revoke the token that made the call.',
      permission: null,
      response: NO_CONTENT,
      notes: [
        "The dashboard's Sign out button must call this before clearing its copy of the token.",
      ],
    },
  ],
};
