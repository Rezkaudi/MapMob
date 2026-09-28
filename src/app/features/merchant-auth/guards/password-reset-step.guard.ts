import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MerchantAuthStore } from '../state/merchant-auth.store';
import { MERCHANT_AUTH_ROUTES } from '../merchant-auth-paths';

function allowWhen(isStepOpen: (store: InstanceType<typeof MerchantAuthStore>) => boolean) {
  return (): ReturnType<CanActivateFn> => {
    const store = inject(MerchantAuthStore);
    return isStepOpen(store) || inject(Router).parseUrl(MERCHANT_AUTH_ROUTES.forgotPassword);
  };
}

export const resetCodeStepGuard: CanActivateFn = allowWhen((store) => store.resetEmail() !== null);

export const newPasswordStepGuard: CanActivateFn = allowWhen(
  (store) => store.resetToken() !== null,
);
