import { getNameInitials } from '../../../shared/formatting/name-initials';
import { formatArabicRelativeTime } from '../../../shared/formatting/arabic-relative-time';
import { AppUser } from '../models/user';
import { USER_ACCOUNT_TYPE_LABEL } from '../models/user-account-type';
import { USER_STATUS_LABEL } from '../models/user-status-label';

/** Seen within this long counts as online, so the pill reads "نشط الآن". */
const ONLINE_WINDOW_MS = 15 * 60_000;
const MISSING_DETAIL_LABEL = 'غير متوفر';
const ONLINE_LABEL = 'نشط الآن';

export interface PresencePill {
  readonly label: string;
  readonly toneClass: string;
  readonly hasDot: boolean;
}

export interface UserProfileView {
  readonly initials: string;
  readonly accountTypeLabel: string;
  readonly presence: PresencePill;
  readonly emailLabel: string;
  readonly phoneLabel: string;
  readonly lastActiveLabel: string;
}

function buildPresence(user: AppUser, now: Date): PresencePill {
  if (user.status === 'suspended') {
    return { label: USER_STATUS_LABEL.suspended, toneClass: 'bg-closed', hasDot: false };
  }
  const isOnline = now.getTime() - new Date(user.lastActiveAt).getTime() <= ONLINE_WINDOW_MS;
  return isOnline
    ? { label: ONLINE_LABEL, toneClass: 'bg-status-success', hasDot: true }
    : { label: USER_STATUS_LABEL.active, toneClass: 'bg-status-success', hasDot: false };
}

export function buildUserProfileView(user: AppUser, now: Date): UserProfileView {
  return {
    initials: getNameInitials(user.name),
    accountTypeLabel: USER_ACCOUNT_TYPE_LABEL[user.accountType],
    presence: buildPresence(user, now),
    emailLabel: user.email ?? MISSING_DETAIL_LABEL,
    phoneLabel: user.phone ?? MISSING_DETAIL_LABEL,
    lastActiveLabel: formatArabicRelativeTime(user.lastActiveAt, now),
  };
}
