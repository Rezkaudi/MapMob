import { AuthenticatedUser } from '../../auth/models/authenticated-user';
import { Credentials } from '../../auth/models/credentials';
import { MERCHANT_ROLE } from '../../auth/models/merchant-role';
import { NewPassword } from '../models/new-password';
import { PasswordResetGrant } from '../models/password-reset-grant';
import { ResetCodeCheck } from '../models/reset-code-check';

const MERCHANT_EMAIL = 'merchant@merchant.com';
const FIRST_PASSWORD = 'merchant';
const RESET_CODE = '123456';
const RESET_TOKEN = 'mock-reset-token';

const WRONG_CREDENTIALS_MESSAGE = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
const WRONG_CODE_MESSAGE = 'رمز التحقق غير صحيح';
const EXPIRED_RESET_MESSAGE = 'انتهت صلاحية طلب إعادة التعيين، اطلب رمزاً جديداً';

const SIGNED_IN_MERCHANT: AuthenticatedUser = {
  id: 'merchant-1',
  name: 'أحمد',
  role: MERCHANT_ROLE,
  avatarUrl: null,
  token: 'mock-merchant-token',
};

/** The one demo owner account. Loaded on first use, so its Arabic copy stays out of the initial bundle. */
export class MerchantAuthMockAccounts {
  private password = FIRST_PASSWORD;

  signIn(credentials: Credentials): AuthenticatedUser {
    const isKnownMerchant = credentials.email.trim().toLowerCase() === MERCHANT_EMAIL;
    if (!isKnownMerchant || credentials.password !== this.password) {
      throw new Error(WRONG_CREDENTIALS_MESSAGE);
    }
    return SIGNED_IN_MERCHANT;
  }

  verifyResetCode(check: ResetCodeCheck): PasswordResetGrant {
    if (check.code !== RESET_CODE) {
      throw new Error(WRONG_CODE_MESSAGE);
    }
    return { resetToken: RESET_TOKEN };
  }

  resetPassword(newPassword: NewPassword): void {
    if (newPassword.resetToken !== RESET_TOKEN) {
      throw new Error(EXPIRED_RESET_MESSAGE);
    }
    this.password = newPassword.password;
  }
}
