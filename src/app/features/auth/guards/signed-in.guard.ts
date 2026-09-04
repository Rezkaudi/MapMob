import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../state/auth.store';

const LOGIN_ROUTE = '/login';

export const signedInGuard: CanActivateFn = () => {
  const store = inject(AuthStore);
  if (store.isSignedIn()) {
    return true;
  }
  return inject(Router).parseUrl(LOGIN_ROUTE);
};
