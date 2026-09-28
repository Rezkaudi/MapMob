import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { AccountProfile } from '../../settings/models/account-profile';
import { AccountProfileDraft } from '../../settings/models/account-profile-draft';
import { PasswordChange } from '../../settings/models/password-change';
import { OwnerAccountRepository } from './owner-account.repository';

/** A store owner has no role, so the badge the admin card draws stays hidden. */
const toProfile = (account: AccountProfileDraft): AccountProfile => ({
  ...account,
  roleName: null,
});

@Injectable()
export class OwnerAccountHttpRepository implements OwnerAccountRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  private get accountUrl(): string {
    return `${this.apiBaseUrl}/owner/account`;
  }

  getProfile(): Observable<AccountProfile> {
    return this.httpClient.get<AccountProfileDraft>(this.accountUrl).pipe(map(toProfile));
  }

  updateProfile(draft: AccountProfileDraft): Observable<AccountProfile> {
    return this.httpClient.put<AccountProfileDraft>(this.accountUrl, draft).pipe(map(toProfile));
  }

  changePassword(change: PasswordChange): Observable<void> {
    return this.httpClient.put<void>(`${this.accountUrl}/password`, change);
  }
}
