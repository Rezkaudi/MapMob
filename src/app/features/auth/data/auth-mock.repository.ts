import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { mockResponse } from '../../../../mock/mock-delay';
import { AuthenticatedUser } from '../models/authenticated-user';
import { Credentials } from '../models/credentials';
import { AuthRepository } from './auth.repository';

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
      return throwError(() => new Error('البريد الإلكتروني وكلمة المرور مطلوبان'));
    }
    return mockResponse(SIGNED_IN_USER);
  }
}
