import { buildUser } from '../testing/user-fixture';
import { buildMockUserDetail } from './user-mock-detail';

const NOW = new Date(2026, 8, 15, 12, 0);

describe('buildMockUserDetail', () => {
  it('wraps the user with activity, favourites and reviews that happened after it joined', () => {
    const user = buildUser({ registeredAt: new Date(2026, 0, 1).toISOString() });

    const detail = buildMockUserDetail(user, NOW);

    expect(detail.user).toEqual(user);
    expect(detail.activities.length).toBeGreaterThan(0);
    expect(detail.favoritePlaces.length).toBeGreaterThan(0);
    expect(detail.reviews.length).toBeGreaterThan(0);
    expect(detail.reviews.every((review) => review.rating >= 1 && review.rating <= 5)).toBe(true);
    expect(detail.stats.favoritePlaceCount).toBe(detail.favoritePlaces.length);
    expect(detail.stats.reviewCount).toBe(detail.reviews.length);
  });

  it('lists the newest activity first', () => {
    const detail = buildMockUserDetail(buildUser(), NOW);

    const times = detail.activities.map((activity) => activity.occurredAt);
    expect(times).toEqual([...times].sort().reverse());
  });
});
