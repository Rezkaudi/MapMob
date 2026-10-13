import { UserSummary } from '../models/user-summary';

const NEW_USER_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface LiveUserCounts {
  readonly totalCount: number;
  readonly suspendedCount: number;
  /** The sign-up moments of the newest users, as far as one page reaches. */
  readonly newestSignUps: readonly string[];
}

export function toUserSummary(counts: LiveUserCounts, now: Date): UserSummary {
  const newSince = now.getTime() - NEW_USER_DAYS * DAY_MS;
  return {
    totalUserCount: counts.totalCount,
    activeUserCount: counts.totalCount - counts.suspendedCount,
    suspendedUserCount: counts.suspendedCount,
    newUserCount: counts.newestSignUps.filter(
      (signedUpAt) => new Date(signedUpAt).getTime() >= newSince,
    ).length,
  };
}
