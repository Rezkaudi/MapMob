import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { AuthStorage } from './auth-storage';

const JSON_TYPE = 'application/json';
const ARABIC = 'ar';

export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith(inject(API_BASE_URL))) {
    return next(request);
  }
  const token = inject(AuthStorage).read()?.token;
  const headers: Record<string, string> = { Accept: JSON_TYPE, 'Accept-Language': ARABIC };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return next(request.clone({ setHeaders: headers }));
};
