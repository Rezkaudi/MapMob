import type { UserSummary } from '../../../users/models/user-summary';

export const USER_ROW = {
  id: '5',
  name: 'أحمد خليل',
  email: 'ahmad@example.com',
  phone: '0936318327',
  accountType: 'registered',
  governorate: { id: '1', name: 'دمشق' },
  status: 'active',
  createdAt: '2026-09-25T18:01:25Z',
  lastActiveAt: '2026-09-27T03:05:43Z',
};

export const USER_SUMMARY = {
  totalUserCount: 9630,
  activeUserCount: 9310,
  suspendedUserCount: 106,
  newUserCount: 214,
} satisfies UserSummary;

export const USER_DETAIL = {
  user: { ...USER_ROW, isPhoneVerified: true },
  stats: { searchCount: 184, viewedPlaceCount: 92, favoritePlaceCount: 14, reviewCount: 6 },
  activities: [
    {
      id: 'a1',
      type: 'search',
      description: 'بحث عن "مطاعم"',
      place: null,
      occurredAt: '2026-09-26T12:02:00Z',
    },
    {
      id: 'a2',
      type: 'favorite',
      description: 'أضاف مطعم الشام إلى المفضلة',
      place: { id: '402', name: 'مطعم الشام' },
      occurredAt: '2026-09-25T09:10:00Z',
    },
  ],
  favoritePlaces: [
    {
      place: { id: '402', name: 'مطعم الشام' },
      category: { id: '2', name: 'مطاعم', icon: 'utensils-crossed', color: '#FF8104' },
      governorate: { id: '1', name: 'دمشق' },
      savedAt: '2026-09-20T10:00:00Z',
    },
  ],
  reviews: [
    {
      id: 'r1',
      place: { id: '402', name: 'مطعم الشام' },
      rating: 5,
      comment: 'خدمة ممتازة',
      status: 'published',
      createdAt: '2026-09-21T09:30:00Z',
    },
  ],
};
