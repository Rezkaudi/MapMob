import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { AccountProfile } from '../models/account-profile';
import { AccountProfileDraft } from '../models/account-profile-draft';
import { PasswordChange } from '../models/password-change';
import { AccountRepository } from './account.repository';

@Injectable()
export class AccountHttpRepository implements AccountRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  private get accountUrl(): string {
    return `${this.apiBaseUrl}/settings/account`;
  }

  getProfile(): Observable<AccountProfile> {
    return this.httpClient.get<AccountProfile>(this.accountUrl);
  }

  updateProfile(draft: AccountProfileDraft): Observable<AccountProfile> {
    return this.httpClient.put<AccountProfile>(this.accountUrl, draft);
  }

  changePassword(change: PasswordChange): Observable<void> {
    return this.httpClient.put<void>(`${this.accountUrl}/password`, change);
  }
}
