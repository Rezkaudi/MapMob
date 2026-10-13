import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { httpStatusOf } from '../../../core/http/http-status-of';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { AuthenticatedUser } from '../models/authenticated-user';
import { Credentials } from '../models/credentials';
import { WRONG_CREDENTIALS_MESSAGE } from './auth-messages';
import { AuthRepository } from './auth.repository';
import { LiveLoginResponse } from './live-login-response';

@Injectable()
export class AuthHttpRepository implements AuthRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly adminUrl = `${inject(API_BASE_URL)}/admin`;

  signIn(credentials: Credentials): Observable<AuthenticatedUser> {
    return this.httpClient
      .post<LiveEnvelope<LiveLoginResponse>>(`${this.adminUrl}/login`, credentials)
      .pipe(
        map(({ data }) => toAuthenticatedUser(data)),
        catchError((error: unknown) =>
          throwError(() =>
            httpStatusOf(error) === HttpStatusCode.Unauthorized
              ? new Error(WRONG_CREDENTIALS_MESSAGE)
              : error,
          ),
        ),
      );
  }

  signOut(): Observable<void> {
    return this.httpClient.post<void>(`${this.adminUrl}/logout`, {});
  }
}

function toAuthenticatedUser({ user, token }: LiveLoginResponse): AuthenticatedUser {
  return { id: String(user.id), name: user.name, role: user.role, avatarUrl: null, token };
}
