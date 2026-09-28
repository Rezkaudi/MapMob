import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../../auth/state/auth.store';
import { MERCHANT_AUTH_ROUTES } from '../merchant-auth-paths';

const ADMIN_HOME_ROUTE = '/admin/dashboard';

export const merchantSignedInGuard: CanActivateFn = () => {
  const store = inject(AuthStore);
  if (store.isMerchant()) {
    return true;
  }
  const router = inject(Router);
  return store.isSignedIn()
    ? router.parseUrl(ADMIN_HOME_ROUTE)
    : router.parseUrl(MERCHANT_AUTH_ROUTES.login);
};
