import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ADMIN_LOGIN_URL } from '../models/login-role';
import { AuthStore } from '../state/auth.store';

const MERCHANT_HOME_ROUTE = '/merchant/dashboard';

export const signedInGuard: CanActivateFn = () => {
  const store = inject(AuthStore);
  if (store.isMerchant()) {
    return inject(Router).parseUrl(MERCHANT_HOME_ROUTE);
  }
  if (store.isSignedIn()) {
    return true;
  }
  return inject(Router).parseUrl(ADMIN_LOGIN_URL);
};
