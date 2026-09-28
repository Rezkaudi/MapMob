import { ChoiceOption } from '../../../shared/ui/choice-chips/choice-option';

/** Which tab of /login is open; it lives in the URL as ?role=admin or ?role=merchant. */
export type LoginRole = 'admin' | 'merchant';

export const LOGIN_ROLE_QUERY_PARAM = 'role';

const LOGIN_PATH = '/login';

export function loginUrlFor(role: LoginRole): string {
  return `${LOGIN_PATH}?${LOGIN_ROLE_QUERY_PARAM}=${role}`;
}

export const ADMIN_LOGIN_URL = loginUrlFor('admin');

/** The admin tab is the default, so a bare /login still opens it. */
export function toLoginRole(value: string | null | undefined): LoginRole {
  return value === 'merchant' ? 'merchant' : 'admin';
}

/** RTL puts the first tab on the right. */
export const LOGIN_ROLE_CHOICES: readonly ChoiceOption[] = [
  { value: 'admin', label: 'حساب الإدارة' },
  { value: 'merchant', label: 'حساب المتجر' },
];
