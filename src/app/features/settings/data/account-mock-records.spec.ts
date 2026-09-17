import { buildAccountProfile } from '../testing/settings-fixture';
import { buildSettingsMockSeed } from '../testing/settings-mock-seed-fixture';
import { AccountMockRecords } from './account-mock-records';

function createRecords() {
  const seed = buildSettingsMockSeed();
  return new AccountMockRecords(seed.account, seed.accountPassword);
}

describe('AccountMockRecords', () => {
  it('returns the signed-in admin profile', () => {
    expect(createRecords().profile()).toEqual(buildAccountProfile());
  });

  it('saves a new name and email and keeps the role', () => {
    const records = createRecords();

    const saved = records.updateProfile({ fullName: 'سارة', email: 'sara@mapmob.com' });

    expect(saved).toEqual(buildAccountProfile({ fullName: 'سارة', email: 'sara@mapmob.com' }));
    expect(records.profile()).toEqual(saved);
  });

  it('changes the password only when the current one is right', () => {
    const records = createRecords();

    expect(() =>
      records.changePassword({ currentPassword: 'wrong', newPassword: 'newPass1234' }),
    ).toThrow('كلمة المرور الحالية غير صحيحة');

    records.changePassword({ currentPassword: 'currentPass123', newPassword: 'newPass1234' });
    expect(() =>
      records.changePassword({ currentPassword: 'currentPass123', newPassword: 'again12345' }),
    ).toThrow('كلمة المرور الحالية غير صحيحة');
  });
});
