import { buildAccountProfile } from '../testing/settings-fixture';
import { buildSettingsMockSeed } from '../testing/settings-mock-seed-fixture';
import { SettingsMockDatabase } from './settings-mock-database';

describe('SettingsMockDatabase', () => {
  it('hands each part of the seed to its own records', () => {
    const database = new SettingsMockDatabase(buildSettingsMockSeed());

    expect(database.account.profile()).toEqual(buildAccountProfile());
    expect(database.platform.settings().general.appName).toBe('MapMob');
    expect(database.notificationAlerts.list()).toHaveLength(5);
    expect(database.paymentMethods.list()).toHaveLength(1);
    expect(database.team.admins()).toHaveLength(3);
  });
});
