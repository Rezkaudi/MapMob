import { buildNotificationAlerts } from '../testing/settings-fixture';
import { buildSettingsMockSeed } from '../testing/settings-mock-seed-fixture';
import { NotificationAlertMockRecords } from './notification-alert-mock-records';

function createRecords() {
  const seed = buildSettingsMockSeed();
  return new NotificationAlertMockRecords(seed.notificationAlerts);
}

describe('NotificationAlertMockRecords', () => {
  it('lists the alerts in the order they are shown', () => {
    expect(createRecords().list()).toEqual(buildNotificationAlerts());
  });

  it('turns one alert on or off', () => {
    const records = createRecords();

    expect(records.setEnabled('new-payment', true)).toEqual({
      kind: 'new-payment',
      isEnabled: true,
    });
    records.setEnabled('new-complaint', false);

    expect(records.list().map((alert) => alert.isEnabled)).toEqual([false, true, true, true, true]);
  });
});
