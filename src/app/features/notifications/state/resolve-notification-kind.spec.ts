import { resolveNotificationKind } from './resolve-notification-kind';

describe('resolveNotificationKind', () => {
  it('calls a notification for everyone general, and one for picked people or a place private', () => {
    expect(resolveNotificationKind('all')).toBe('general');
    expect(resolveNotificationKind('selected')).toBe('private');
    expect(resolveNotificationKind('location')).toBe('private');
  });
});
