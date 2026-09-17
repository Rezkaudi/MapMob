import { AccountProfile } from '../models/account-profile';
import { AccountProfileDraft } from '../models/account-profile-draft';
import { PasswordChange } from '../models/password-change';

export class AccountMockRecords {
  constructor(
    private account: AccountProfile,
    private password: string,
  ) {}

  profile(): AccountProfile {
    return this.account;
  }

  updateProfile(draft: AccountProfileDraft): AccountProfile {
    this.account = { ...this.account, ...draft };
    return this.account;
  }

  changePassword({ currentPassword, newPassword }: PasswordChange): void {
    if (currentPassword !== this.password) {
      throw new Error('كلمة المرور الحالية غير صحيحة');
    }
    this.password = newPassword;
  }
}
