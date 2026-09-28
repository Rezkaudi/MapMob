import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mockRequest } from '../../../../mock/mock-delay';
import { AccountMockRecords } from '../../settings/data/account-mock-records';
import { AccountProfile } from '../../settings/models/account-profile';
import { AccountProfileDraft } from '../../settings/models/account-profile-draft';
import { PasswordChange } from '../../settings/models/password-change';
import { OwnerAccountRepository } from './owner-account.repository';

const OWNER_ACCOUNT_SEED: AccountProfile = {
  fullName: 'محمد احمد',
  email: 'mmmm.mo@mapmob.com',
  roleName: null,
};

/** The demo merchant signs in with "merchant", so that is the current password here too. */
const OWNER_DEMO_PASSWORD = 'merchant';

@Injectable()
export class OwnerAccountMockRepository implements OwnerAccountRepository {
  private readonly records = new AccountMockRecords(OWNER_ACCOUNT_SEED, OWNER_DEMO_PASSWORD);

  getProfile(): Observable<AccountProfile> {
    return mockRequest(() => this.records.profile());
  }

  updateProfile(draft: AccountProfileDraft): Observable<AccountProfile> {
    return mockRequest(() => this.records.updateProfile(draft));
  }

  changePassword(change: PasswordChange): Observable<void> {
    return mockRequest(() => this.records.changePassword(change));
  }
}
