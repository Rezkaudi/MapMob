import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { AccountProfile } from '../models/account-profile';
import { AccountProfileDraft } from '../models/account-profile-draft';
import { PasswordChange } from '../models/password-change';
import { AccountRepository } from './account.repository';

@Injectable()
export class AccountHttpRepository implements AccountRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly accountUrl = `${inject(API_BASE_URL)}/admin/settings/account`;

  getProfile(): Observable<AccountProfile> {
    return this.httpClient
      .get<LiveEnvelope<AccountProfile>>(this.accountUrl)
      .pipe(map(({ data }) => data));
  }

  updateProfile(draft: AccountProfileDraft): Observable<AccountProfile> {
    return this.httpClient
      .put<LiveEnvelope<AccountProfile>>(this.accountUrl, draft)
      .pipe(map(({ data }) => data));
  }

  changePassword(change: PasswordChange): Observable<void> {
    return this.httpClient.put(`${this.accountUrl}/password`, change).pipe(map(() => undefined));
  }
}
