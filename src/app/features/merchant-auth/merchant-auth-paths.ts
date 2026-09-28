import { loginUrlFor } from '../auth/models/login-role';

/** Every merchant sign-in screen, so pages and guards link to one source. */
export const MERCHANT_AUTH_ROUTES = {
  home: '/merchant/dashboard',
  login: loginUrlFor('merchant'),
  forgotPassword: '/merchant/forgot-password',
  resetCode: '/merchant/reset-code',
  newPassword: '/merchant/new-password',
} as const;
