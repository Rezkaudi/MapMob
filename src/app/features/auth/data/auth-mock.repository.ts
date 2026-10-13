import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { mockResponse } from '../../../../mock/mock-delay';
import { AuthenticatedUser } from '../models/authenticated-user';
import { Credentials } from '../models/credentials';
import { MISSING_FIELDS_MESSAGE, WRONG_CREDENTIALS_MESSAGE } from './auth-messages';
import { AuthRepository } from './auth.repository';

const ADMIN_EMAIL = 'admin@admin.com';
const ADMIN_PASSWORD = 'admin';

const SIGNED_IN_USER: AuthenticatedUser = {
  id: 'user-admin',
  name: 'أحمد',
  role: 'Admin',
  avatarUrl: null,
  token: 'mock-token',
};

@Injectable()
export class AuthMockRepository implements AuthRepository {
  signIn(credentials: Credentials): Observable<AuthenticatedUser> {
    if (!credentials.email || !credentials.password) {
      return throwError(() => new Error(MISSING_FIELDS_MESSAGE));
    }
    if (
      credentials.email.trim().toLowerCase() !== ADMIN_EMAIL ||
      credentials.password !== ADMIN_PASSWORD
    ) {
      return throwError(() => new Error(WRONG_CREDENTIALS_MESSAGE));
    }
    return mockResponse(SIGNED_IN_USER);
  }

  signOut(): Observable<void> {
    return mockResponse(undefined);
  }
}
