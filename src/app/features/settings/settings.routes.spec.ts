import { SETTINGS_ROUTES } from './settings.routes';

describe('SETTINGS_ROUTES', () => {
  const [layoutRoute] = SETTINGS_ROUTES;

  it('wraps every settings page in the layout', () => {
    expect(SETTINGS_ROUTES).toHaveLength(1);
    expect(layoutRoute.path).toBe('');
    expect(layoutRoute.loadComponent).toBeDefined();
  });

  it('opens the account tab first', () => {
    expect(layoutRoute.children?.[0]).toEqual({
      path: '',
      redirectTo: 'account',
      pathMatch: 'full',
    });
  });

  it('gives each tab its own page', () => {
    expect(layoutRoute.children?.slice(1).map((route) => route.path)).toEqual([
      'account',
      'platform',
      'notifications',
      'payments',
      'admins',
      'roles',
    ]);
  });
});
