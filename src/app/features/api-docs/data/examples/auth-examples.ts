import type { Credentials } from '../../../auth/models/credentials';

export const SIGN_IN_REQUEST = {
  email: 'obedah@gmail.com',
  password: 'secret-password',
} satisfies Credentials;

export const CURRENT_ADMIN = {
  id: '1',
  name: 'Obedah',
  email: 'obedah@gmail.com',
  avatarUrl: null,
  role: { id: '1', name: 'مسؤول النظام الرئيسي', isFullAccess: true },
  permissions: ['places:view', 'places:add', 'places:edit', 'places:delete'],
};

export const SIGNED_IN_ADMIN = {
  token: '19|IMIsakH3jSYZAYYrrTvsc6rEpQX4Fad1d0nPq2Lx',
  expiresAt: '2026-10-28T09:00:00Z',
  admin: CURRENT_ADMIN,
};
