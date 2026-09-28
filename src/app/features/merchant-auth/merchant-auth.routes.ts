import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { newPasswordStepGuard, resetCodeStepGuard } from './guards/password-reset-step.guard';
import { MERCHANT_AUTH_ROUTES } from './merchant-auth-paths';

/** The signed-out merchant screens, each outside any dashboard shell. */
export const MERCHANT_AUTH_PAGE_ROUTES: Routes = [
  {
    // The merchant tab of the one /login page; kept so old links still work.
    path: 'login',
    redirectTo: () => inject(Router).parseUrl(MERCHANT_AUTH_ROUTES.login),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password').then((m) => m.ForgotPassword),
  },
  {
    path: 'reset-code',
    canActivate: [resetCodeStepGuard],
    loadComponent: () => import('./pages/reset-code/reset-code').then((m) => m.ResetCode),
  },
  {
    path: 'new-password',
    canActivate: [newPasswordStepGuard],
    loadComponent: () => import('./pages/new-password/new-password').then((m) => m.NewPasswordPage),
  },
];
