import { buildUserSeed } from './user-mock-seed';

const NOW = new Date(2026, 8, 15, 12, 0);

describe('buildUserSeed', () => {
  it('builds the same users every time, never registered in the future', () => {
    const first = buildUserSeed(NOW, 50);
    const second = buildUserSeed(NOW, 50);

    expect(first).toHaveLength(50);
    expect(first).toEqual(second);
    expect(first.every((user) => new Date(user.registeredAt) <= NOW)).toBe(true);
    expect(first.every((user) => new Date(user.lastActiveAt) >= new Date(user.registeredAt))).toBe(
      true,
    );
  });

  it('mixes account types and statuses, and leaves visitors without contact details', () => {
    const users = buildUserSeed(NOW, 200);

    expect(new Set(users.map((user) => user.accountType))).toEqual(
      new Set(['registered', 'visitor']),
    );
    expect(new Set(users.map((user) => user.status))).toEqual(new Set(['active', 'suspended']));
    expect(
      users.filter((user) => user.accountType === 'visitor').every((user) => !user.email),
    ).toBe(true);
  });

  it('starts with the sample person the design draws, active ten minutes ago', () => {
    const [first] = buildUserSeed(NOW, 3);

    expect(first).toMatchObject({
      id: 'user-1',
      name: 'أحمد جمال',
      email: 'ahmad@example.com',
      phone: '+966 50 123 4567',
      accountType: 'registered',
      governorateName: 'طرطوس',
      status: 'active',
    });
    expect(NOW.getTime() - new Date(first.lastActiveAt).getTime()).toBe(10 * 60_000);
  });
});
