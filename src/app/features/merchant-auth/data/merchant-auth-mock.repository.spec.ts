import { firstValueFrom } from 'rxjs';
import { MerchantAuthMockRepository } from './merchant-auth-mock.repository';

const MERCHANT_EMAIL = 'merchant@merchant.com';
const MERCHANT_PASSWORD = 'merchant';
const RESET_CODE = '123456';

describe('MerchantAuthMockRepository', () => {
  it('signs the demo merchant in with the owner role', async () => {
    const repository = new MerchantAuthMockRepository();

    const user = await firstValueFrom(
      repository.signIn({ email: MERCHANT_EMAIL, password: MERCHANT_PASSWORD }),
    );

    expect(user.role).toBe('owner');
    expect(user.name).toBe('أحمد');
  });

  it('rejects wrong credentials without saying which field was wrong', async () => {
    const repository = new MerchantAuthMockRepository();

    await expect(
      firstValueFrom(repository.signIn({ email: MERCHANT_EMAIL, password: 'nope' })),
    ).rejects.toThrow('البريد الإلكتروني أو كلمة المرور غير صحيحة');
  });

  it('accepts a reset code request for any email, so it never leaks which accounts exist', async () => {
    const repository = new MerchantAuthMockRepository();

    await expect(firstValueFrom(repository.sendResetCode('someone@else.com'))).resolves.toBe(
      undefined,
    );
  });

  it('trades the right code for a reset token', async () => {
    const repository = new MerchantAuthMockRepository();

    const grant = await firstValueFrom(
      repository.verifyResetCode({ email: MERCHANT_EMAIL, code: RESET_CODE }),
    );

    expect(grant.resetToken).toBeTruthy();
  });

  it('refuses a wrong code', async () => {
    const repository = new MerchantAuthMockRepository();

    await expect(
      firstValueFrom(repository.verifyResetCode({ email: MERCHANT_EMAIL, code: '000000' })),
    ).rejects.toThrow('رمز التحقق غير صحيح');
  });

  it('sets the new password, so the merchant can sign in with it', async () => {
    const repository = new MerchantAuthMockRepository();
    const grant = await firstValueFrom(
      repository.verifyResetCode({ email: MERCHANT_EMAIL, code: RESET_CODE }),
    );

    await firstValueFrom(
      repository.resetPassword({ resetToken: grant.resetToken, password: 'new-secret-1' }),
    );
    const user = await firstValueFrom(
      repository.signIn({ email: MERCHANT_EMAIL, password: 'new-secret-1' }),
    );

    expect(user.role).toBe('owner');
  });
});
