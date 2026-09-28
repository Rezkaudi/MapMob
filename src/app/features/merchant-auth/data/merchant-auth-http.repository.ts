import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { AuthenticatedUser } from '../../auth/models/authenticated-user';
import { Credentials } from '../../auth/models/credentials';
import { NewPassword } from '../models/new-password';
import { PasswordResetGrant } from '../models/password-reset-grant';
import { ResetCodeCheck } from '../models/reset-code-check';
import { MerchantAuthRepository } from './merchant-auth.repository';

@Injectable()
export class MerchantAuthHttpRepository implements MerchantAuthRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  signIn(credentials: Credentials): Observable<AuthenticatedUser> {
    return this.httpClient.post<AuthenticatedUser>(
      `${this.apiBaseUrl}/owner/auth/login`,
      credentials,
    );
  }

  sendResetCode(email: string): Observable<void> {
    return this.httpClient.post<void>(`${this.apiBaseUrl}/owner/auth/password/forgot`, {
      email,
    });
  }

  verifyResetCode(check: ResetCodeCheck): Observable<PasswordResetGrant> {
    return this.httpClient.post<PasswordResetGrant>(
      `${this.apiBaseUrl}/owner/auth/password/verify-code`,
      check,
    );
  }

  resetPassword(newPassword: NewPassword): Observable<void> {
    return this.httpClient.post<void>(`${this.apiBaseUrl}/owner/auth/password/reset`, newPassword);
  }
}
