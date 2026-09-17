import { NO_NOTIFICATION_FILTERS } from '../models/notification-filters';
import { countActiveNotificationFilters } from './count-active-notification-filters';

describe('countActiveNotificationFilters', () => {
  it('counts nothing when every filter is "الكل"', () => {
    expect(countActiveNotificationFilters(NO_NOTIFICATION_FILTERS)).toBe(0);
  });

  it('counts the audience, the kind, the status and the send period', () => {
    expect(
      countActiveNotificationFilters({
        audience: 'users',
        kind: 'general',
        status: 'sent',
        sendPeriod: 'last7Days',
        customRange: { from: null, to: null },
      }),
    ).toBe(4);
    expect(
      countActiveNotificationFilters({ ...NO_NOTIFICATION_FILTERS, sendPeriod: 'custom' }),
    ).toBe(1);
  });
});
