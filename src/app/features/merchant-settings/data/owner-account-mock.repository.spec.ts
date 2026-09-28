import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { OwnerAccountMockRepository } from './owner-account-mock.repository';

describe('OwnerAccountMockRepository', () => {
  let repository: OwnerAccountMockRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [OwnerAccountMockRepository] });
    repository = TestBed.inject(OwnerAccountMockRepository);
  });

  it('starts from the name and email the merchant settings frame shows', async () => {
    expect(await firstValueFrom(repository.getProfile())).toEqual({
      fullName: 'محمد احمد',
      email: 'mmmm.mo@mapmob.com',
      roleName: null,
    });
  });

  it('keeps a saved name for the next read', async () => {
    await firstValueFrom(
      repository.updateProfile({ fullName: 'سارة أحمد', email: 'mmmm.mo@mapmob.com' }),
    );

    expect((await firstValueFrom(repository.getProfile())).fullName).toBe('سارة أحمد');
  });

  it('accepts the demo sign-in password as the current one and refuses any other', async () => {
    await expect(
      firstValueFrom(repository.changePassword({ currentPassword: 'wrong', newPassword: 'x' })),
    ).rejects.toThrow('كلمة المرور الحالية غير صحيحة');

    await expect(
      firstValueFrom(
        repository.changePassword({ currentPassword: 'merchant', newPassword: 'newPass1234' }),
      ),
    ).resolves.toBeUndefined();
  });
});
