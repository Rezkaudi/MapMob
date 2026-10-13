import { LiveUser } from './live-user';
import { toAppUser, toUserDetail } from './live-user-mapping';

const LIVE_USER: LiveUser = {
  id: 11,
  name: 'mohamad',
  email: 'm@example.com',
  phone: '963956336101',
  status: 'active',
  'SELECTED LOCATION': 'محافظة دمشق',
  lastActiveAt: '2026-10-12T08:00:00.000000Z',
  created_at: '2026-09-29T18:53:05.000000Z',
};

describe('toAppUser', () => {
  it('turns a server user into a table row', () => {
    expect(toAppUser(LIVE_USER)).toEqual({
      id: '11',
      name: 'mohamad',
      email: 'm@example.com',
      phone: '963956336101',
      accountType: 'registered',
      governorateName: 'محافظة دمشق',
      registeredAt: '2026-09-29T18:53:05.000000Z',
      lastActiveAt: '2026-10-12T08:00:00.000000Z',
      status: 'active',
    });
  });

  it('reads every status but active as suspended', () => {
    expect(toAppUser({ ...LIVE_USER, status: 'suspended' }).status).toBe('suspended');
    expect(toAppUser({ ...LIVE_USER, status: 'banned' }).status).toBe('suspended');
  });

  it('falls back to the sign-up day when the server has no last visit', () => {
    const user = toAppUser({ ...LIVE_USER, lastActiveAt: null });

    expect(user.lastActiveAt).toBe('2026-09-29T18:53:05.000000Z');
  });

  it('shows a dash when the user picked no location', () => {
    expect(toAppUser({ ...LIVE_USER, 'SELECTED LOCATION': null }).governorateName).toBe('—');
    expect(toAppUser({ ...LIVE_USER, 'SELECTED LOCATION': undefined }).governorateName).toBe('—');
  });
});

describe('toUserDetail', () => {
  it('opens the user page with empty activity, since the server sends none yet', () => {
    expect(toUserDetail(LIVE_USER)).toEqual({
      user: toAppUser(LIVE_USER),
      stats: { searchCount: 0, viewedPlaceCount: 0, favoritePlaceCount: 0, reviewCount: 0 },
      activities: [],
      favoritePlaces: [],
      reviews: [],
    });
  });
});
