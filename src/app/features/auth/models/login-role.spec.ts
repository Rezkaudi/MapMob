import { LOGIN_ROLE_CHOICES, loginUrlFor, toLoginRole } from './login-role';

describe('login role', () => {
  it('reads ?role=merchant as the merchant tab', () => {
    expect(toLoginRole('merchant')).toBe('merchant');
  });

  it('falls back to the admin tab for no value or anything else', () => {
    expect(toLoginRole(undefined)).toBe('admin');
    expect(toLoginRole(null)).toBe('admin');
    expect(toLoginRole('owner')).toBe('admin');
  });

  it('lists the admin tab first, so RTL puts it on the right', () => {
    expect(LOGIN_ROLE_CHOICES.map((choice) => choice.value)).toEqual(['admin', 'merchant']);
    expect(LOGIN_ROLE_CHOICES.map((choice) => choice.label)).toEqual([
      'حساب الإدارة',
      'حساب المتجر',
    ]);
  });

  it('writes each tab into the URL, the admin one too', () => {
    expect(loginUrlFor('admin')).toBe('/login?role=admin');
    expect(loginUrlFor('merchant')).toBe('/login?role=merchant');
  });
});
