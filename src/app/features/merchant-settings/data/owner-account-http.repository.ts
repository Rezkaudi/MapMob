import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { AccountProfile } from '../../settings/models/account-profile';
import { AccountProfileDraft } from '../../settings/models/account-profile-draft';
import { PasswordChange } from '../../settings/models/password-change';
import { LiveOwnerAccount } from './live-owner-account';
import { OwnerAccountRepository } from './owner-account.repository';

/** A store owner has no role, so the badge the admin card draws stays hidden. */
const toProfile = ({ name, email }: LiveOwnerAccount): AccountProfile => ({
  fullName: name,
  email,
  roleName: null,
});

@Injectable()
export class OwnerAccountHttpRepository implements OwnerAccountRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly accountUrl = `${inject(API_BASE_URL)}/owner/account`;

  getProfile(): Observable<AccountProfile> {
    return this.httpClient
      .get<LiveEnvelope<LiveOwnerAccount>>(this.accountUrl)
      .pipe(map(({ data }) => toProfile(data)));
  }

  updateProfile(draft: AccountProfileDraft): Observable<AccountProfile> {
    return this.httpClient
      .put<LiveEnvelope<LiveOwnerAccount>>(this.accountUrl, {
        name: draft.fullName,
        email: draft.email,
      })
      .pipe(map(({ data }) => toProfile(data)));
  }

  changePassword({ currentPassword, newPassword }: PasswordChange): Observable<void> {
    return this.httpClient
      .put<unknown>(`${this.accountUrl}/password`, {
        currentPassword,
        newPassword,
        newPassword_confirmation: newPassword,
      })
      .pipe(map(() => undefined));
  }
}
