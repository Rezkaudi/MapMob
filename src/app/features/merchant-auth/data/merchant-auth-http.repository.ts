import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { httpStatusOf } from '../../../core/http/http-status-of';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { WRONG_CREDENTIALS_MESSAGE } from '../../auth/data/auth-messages';
import { LiveLoginResponse } from '../../auth/data/live-login-response';
import { AuthenticatedUser } from '../../auth/models/authenticated-user';
import { Credentials } from '../../auth/models/credentials';
import { MERCHANT_ROLE } from '../../auth/models/merchant-role';
import { NewPassword } from '../models/new-password';
import { PasswordResetGrant } from '../models/password-reset-grant';
import { ResetCodeCheck } from '../models/reset-code-check';
import { LiveResetCodeAnswer } from './live-reset-code-answer';
import { MerchantAuthRepository } from './merchant-auth.repository';

@Injectable()
export class MerchantAuthHttpRepository implements MerchantAuthRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly authUrl = `${inject(API_BASE_URL)}/owner/auth`;

  signIn(credentials: Credentials): Observable<AuthenticatedUser> {
    return this.httpClient
      .post<LiveEnvelope<LiveLoginResponse>>(`${this.authUrl}/login`, credentials)
      .pipe(
        map(({ data }) => toMerchantUser(data)),
        catchError((error: unknown) =>
          throwError(() =>
            httpStatusOf(error) === HttpStatusCode.Unauthorized
              ? new Error(WRONG_CREDENTIALS_MESSAGE)
              : error,
          ),
        ),
      );
  }

  sendResetCode(email: string): Observable<void> {
    return this.httpClient
      .post<unknown>(`${this.authUrl}/password/forgot`, { email })
      .pipe(map(() => undefined));
  }

  verifyResetCode({ email, code }: ResetCodeCheck): Observable<PasswordResetGrant> {
    return this.httpClient
      .post<Partial<LiveEnvelope<LiveResetCodeAnswer | null>>>(
        `${this.authUrl}/password/verify-code`,
        { email, otp: code },
      )
      .pipe(map((answer) => ({ resetToken: resetTokenOf(answer?.data, code) })));
  }

  resetPassword({ email, resetToken, password }: NewPassword): Observable<void> {
    return this.httpClient
      .post<unknown>(`${this.authUrl}/password/reset`, {
        email,
        recovery_token: resetToken,
        password,
        password_confirmation: password,
      })
      .pipe(map(() => undefined));
  }
}

// The server calls the place owner "vendor"; the app calls it "owner".
function toMerchantUser({ user, token }: LiveLoginResponse): AuthenticatedUser {
  return { id: String(user.id), name: user.name, role: MERCHANT_ROLE, avatarUrl: null, token };
}

// The collection sends the code itself as recovery_token, so it is the fallback.
function resetTokenOf(answer: LiveResetCodeAnswer | null | undefined, code: string): string {
  return answer?.recovery_token ?? answer?.recoveryToken ?? answer?.token ?? code;
}
