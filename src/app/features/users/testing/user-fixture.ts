import { AppUser } from '../models/user';
import { UserDetail } from '../models/user-detail';

export function buildUser(overrides: Partial<AppUser> = {}): AppUser {
  return {
    id: 'user-1',
    name: 'أحمد جمال',
    email: 'ahmad@email.com',
    phone: '+966 50 123 4567',
    accountType: 'registered',
    governorateName: 'طرطوس',
    registeredAt: '2024-01-12T00:00:00.000Z',
    lastActiveAt: '2024-01-14T00:00:00.000Z',
    status: 'active',
    ...overrides,
  };
}

export function buildUserDetail(overrides: Partial<UserDetail> = {}): UserDetail {
  return {
    user: buildUser(),
    stats: { searchCount: 139, viewedPlaceCount: 26, favoritePlaceCount: 12, reviewCount: 17 },
    activities: [
      {
        id: 'activity-1',
        type: 'search',
        description: 'بحث عن مطاعم وكافيهات في حي الروضة',
        occurredAt: '2024-01-13T23:50:00.000Z',
      },
    ],
    favoritePlaces: [
      {
        id: 'favorite-1',
        placeName: 'مطعم النخيل',
        placeKind: 'restaurant',
        categoryName: 'مطاعم',
        governorateName: 'طرطوس',
        savedAt: '2024-01-12T00:00:00.000Z',
      },
    ],
    reviews: [
      {
        id: 'review-1',
        placeName: 'مطعم النخيل',
        categoryName: 'مطاعم',
        locationName: 'حي النخيل، الرياض',
        rating: 5,
        comment: 'الخدمة ممتازة والمكان جميل جداً.',
        reviewedAt: '2026-09-02T08:00:00.000Z',
      },
    ],
    ...overrides,
  };
}
