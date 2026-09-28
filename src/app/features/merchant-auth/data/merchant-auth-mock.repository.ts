import { Injectable } from '@angular/core';
import { Observable, from, switchMap } from 'rxjs';
import { mockRequest } from '../../../../mock/mock-delay';
import { AuthenticatedUser } from '../../auth/models/authenticated-user';
import { Credentials } from '../../auth/models/credentials';
import { NewPassword } from '../models/new-password';
import { PasswordResetGrant } from '../models/password-reset-grant';
import { ResetCodeCheck } from '../models/reset-code-check';
import type { MerchantAuthMockAccounts } from './merchant-auth-mock-accounts';
import { MerchantAuthRepository } from './merchant-auth.repository';

@Injectable()
export class MerchantAuthMockRepository implements MerchantAuthRepository {
  private accounts: Promise<MerchantAuthMockAccounts> | null = null;

  signIn(credentials: Credentials): Observable<AuthenticatedUser> {
    return this.withAccounts((accounts) => accounts.signIn(credentials));
  }

  // Answers the same for every email, as the real API must, so nobody can probe for accounts.
  sendResetCode(_email: string): Observable<void> {
    return mockRequest(() => undefined);
  }

  verifyResetCode(check: ResetCodeCheck): Observable<PasswordResetGrant> {
    return this.withAccounts((accounts) => accounts.verifyResetCode(check));
  }

  resetPassword(newPassword: NewPassword): Observable<void> {
    return this.withAccounts((accounts) => accounts.resetPassword(newPassword));
  }

  private withAccounts<TResult>(
    work: (accounts: MerchantAuthMockAccounts) => TResult,
  ): Observable<TResult> {
    this.accounts ??= import('./merchant-auth-mock-accounts').then(
      (module) => new module.MerchantAuthMockAccounts(),
    );
    return from(this.accounts).pipe(switchMap((accounts) => mockRequest(() => work(accounts))));
  }
}
