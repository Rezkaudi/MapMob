import { Observable } from 'rxjs';
import { AuthenticatedUser } from '../../auth/models/authenticated-user';
import { Credentials } from '../../auth/models/credentials';
import { NewPassword } from '../models/new-password';
import { PasswordResetGrant } from '../models/password-reset-grant';
import { ResetCodeCheck } from '../models/reset-code-check';

export abstract class MerchantAuthRepository {
  abstract signIn(credentials: Credentials): Observable<AuthenticatedUser>;
  abstract sendResetCode(email: string): Observable<void>;
  abstract verifyResetCode(check: ResetCodeCheck): Observable<PasswordResetGrant>;
  abstract resetPassword(newPassword: NewPassword): Observable<void>;
}
