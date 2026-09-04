import { firstValueFrom } from 'rxjs';
import { AuthMockRepository } from './auth-mock.repository';

describe('AuthMockRepository', () => {
  const repository = new AuthMockRepository();

  it('signs in the admin with the known email and password', async () => {
    const user = await firstValueFrom(
      repository.signIn({ email: 'admin@admin.com', password: 'admin' }),
    );

    expect(user.role).toBe('Admin');
  });

  it('fails when the email does not match the admin email', async () => {
    await expect(
      firstValueFrom(repository.signIn({ email: 'someone@admin.com', password: 'admin' })),
    ).rejects.toThrow('البريد الإلكتروني أو كلمة المرور غير صحيحة');
  });

  it('fails when the password does not match the admin password', async () => {
    await expect(
      firstValueFrom(repository.signIn({ email: 'admin@admin.com', password: 'wrong' })),
    ).rejects.toThrow('البريد الإلكتروني أو كلمة المرور غير صحيحة');
  });

  it('fails when a field is empty', async () => {
    await expect(firstValueFrom(repository.signIn({ email: '', password: '' }))).rejects.toThrow(
      'البريد الإلكتروني وكلمة المرور مطلوبان',
    );
  });
});
