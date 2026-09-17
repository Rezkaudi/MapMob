import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountProfile } from '../models/account-profile';
import { AccountProfileDraft } from '../models/account-profile-draft';
import { PasswordChange } from '../models/password-change';
import { AccountRepository } from './account.repository';
import { SettingsMockDatabaseLoader } from './settings-mock-database-loader';

@Injectable()
export class AccountMockRepository implements AccountRepository {
  private readonly loader = inject(SettingsMockDatabaseLoader);

  getProfile(): Observable<AccountProfile> {
    return this.loader.request((database) => database.account.profile());
  }

  updateProfile(draft: AccountProfileDraft): Observable<AccountProfile> {
    return this.loader.request((database) => database.account.updateProfile(draft));
  }

  changePassword(change: PasswordChange): Observable<void> {
    return this.loader.request((database) => database.account.changePassword(change));
  }
}
