import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { SettingsMockDatabaseLoader } from './settings-mock-database-loader';

describe('SettingsMockDatabaseLoader', () => {
  it('builds the database from the seed once, and hands the same one to every request', async () => {
    TestBed.configureTestingModule({ providers: [SettingsMockDatabaseLoader] });
    const loader = TestBed.inject(SettingsMockDatabaseLoader);

    await firstValueFrom(
      loader.request((database) =>
        database.account.updateProfile({ fullName: 'اسم جديد', email: 'new@mapmob.com' }),
      ),
    );
    const profile = await firstValueFrom(loader.request((database) => database.account.profile()));

    expect(profile.fullName).toBe('اسم جديد');
  });

  it('reports a failing request as an error event', async () => {
    TestBed.configureTestingModule({ providers: [SettingsMockDatabaseLoader] });
    const loader = TestBed.inject(SettingsMockDatabaseLoader);

    await expect(
      firstValueFrom(
        loader.request((database) =>
          database.account.changePassword({ currentPassword: 'wrong', newPassword: 'newPass1234' }),
        ),
      ),
    ).rejects.toThrow('كلمة المرور الحالية غير صحيحة');
  });
});
