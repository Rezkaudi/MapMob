import { UserSummary } from '../models/user-summary';

const STAT_ICON = 'users';
const NUMBER_FORMAT = new Intl.NumberFormat('en-US');

export interface UserStatCard {
  readonly label: string;
  readonly value: string;
  readonly icon: string;
}

function formatCount(value: number | undefined): string {
  return NUMBER_FORMAT.format(value ?? 0);
}

/** The design groups thousands with a comma and marks the new users with a trailing plus. */
export function buildUserStatCards(summary: UserSummary | null): readonly UserStatCard[] {
  return [
    { label: 'إجمالي المستخدمين', value: formatCount(summary?.totalUserCount), icon: STAT_ICON },
    { label: 'المستخدمون النشطون', value: formatCount(summary?.activeUserCount), icon: STAT_ICON },
    {
      label: 'المستخدمون الموقوفون',
      value: formatCount(summary?.suspendedUserCount),
      icon: STAT_ICON,
    },
    { label: 'المستخدمون الجدد', value: `${formatCount(summary?.newUserCount)}+`, icon: STAT_ICON },
  ];
}
