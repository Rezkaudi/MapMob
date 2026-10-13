import { toUserSummary } from './live-user-summary';

const NOW = new Date('2026-10-13T12:00:00.000Z');

describe('toUserSummary', () => {
  it('counts active users as all users without the suspended ones', () => {
    const summary = toUserSummary({ totalCount: 12, suspendedCount: 2, newestSignUps: [] }, NOW);

    expect(summary.totalUserCount).toBe(12);
    expect(summary.suspendedUserCount).toBe(2);
    expect(summary.activeUserCount).toBe(10);
  });

  it('counts as new the users who signed up in the last 30 days', () => {
    const summary = toUserSummary(
      {
        totalCount: 3,
        suspendedCount: 0,
        newestSignUps: [
          '2026-10-10T10:33:53.000000Z',
          '2026-09-13T12:00:00.000000Z',
          '2026-09-13T11:59:59.000000Z',
        ],
      },
      NOW,
    );

    expect(summary.newUserCount).toBe(2);
  });
});
