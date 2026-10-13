import { ActivationStatus } from '../../../shared/models/activation-status';
import { AppUser } from '../models/user';
import { UserDetail } from '../models/user-detail';
import { LiveUser } from './live-user';

const NO_GOVERNORATE_LABEL = '—';
const NO_ACTIVITY_STATS = {
  searchCount: 0,
  viewedPlaceCount: 0,
  favoritePlaceCount: 0,
  reviewCount: 0,
};

function toUserStatus(liveStatus: string): ActivationStatus {
  return liveStatus === 'active' ? 'active' : 'suspended';
}

export function toAppUser(user: LiveUser): AppUser {
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    phone: user.phone,
    // The server lists accounts only; a visitor has none.
    accountType: 'registered',
    governorateName: user['SELECTED LOCATION'] ?? NO_GOVERNORATE_LABEL,
    registeredAt: user.created_at,
    // The server does not record visits yet, so the sign-up moment stands in.
    lastActiveAt: user.lastActiveAt ?? user.created_at,
    status: toUserStatus(user.status),
  };
}

/** The server sends the account only: no stats, activity, favourites or reviews yet. */
export function toUserDetail(user: LiveUser): UserDetail {
  return {
    user: toAppUser(user),
    stats: NO_ACTIVITY_STATS,
    activities: [],
    favoritePlaces: [],
    reviews: [],
  };
}
