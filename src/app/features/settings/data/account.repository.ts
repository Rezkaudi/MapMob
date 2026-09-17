import { Observable } from 'rxjs';
import { AccountProfile } from '../models/account-profile';
import { AccountProfileDraft } from '../models/account-profile-draft';
import { PasswordChange } from '../models/password-change';

export abstract class AccountRepository {
  abstract getProfile(): Observable<AccountProfile>;
  abstract updateProfile(draft: AccountProfileDraft): Observable<AccountProfile>;
  abstract changePassword(change: PasswordChange): Observable<void>;
}
