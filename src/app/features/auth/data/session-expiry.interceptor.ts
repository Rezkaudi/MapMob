import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ADMIN_LOGIN_URL } from '../models/login-role';
import { AuthStore } from '../state/auth.store';

export const sessionExpiryInterceptor: HttpInterceptorFn = (request, next) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  return next(request).pipe(
    catchError((error: unknown) => {
      if (isRefusedToken(error) && request.headers.has('Authorization')) {
        authStore.signOut();
        void router.navigateByUrl(ADMIN_LOGIN_URL);
      }
      return throwError(() => error);
    }),
  );
};

function isRefusedToken(error: unknown): boolean {
  return error instanceof HttpErrorResponse && error.status === HttpStatusCode.Unauthorized;
}
