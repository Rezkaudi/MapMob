import { formatGroupedNumber } from '../../../shared/formatting/grouped-number';
import { GameStatCard } from '../models/game-stat-card';
import { GameSummary } from '../models/game-summary';

const SINCE_APP_LAUNCH = 'منذ انطلاق التطبيق';
const SINCE_GAME_LAUNCH = 'منذ انطلاق اللعبة';

/** RTL puts the first card on the right, so the game total leads. */
export function buildGameStatCards(summary: GameSummary | null): readonly GameStatCard[] {
  const winnerCount = summary?.winnerCount ?? 0;
  return [
    {
      label: 'إجمالي الألعاب',
      value: formatGroupedNumber(summary?.gameCount ?? 0),
      note: SINCE_APP_LAUNCH,
      icon: 'trending-up-feather',
    },
    {
      label: 'إجمالي المشاركين',
      value: formatGroupedNumber(summary?.participantCount ?? 0),
      note: SINCE_GAME_LAUNCH,
      icon: 'external-link-feather',
    },
    {
      label: 'عدد الفائزين',
      value: formatGroupedNumber(winnerCount),
      note: SINCE_APP_LAUNCH,
      icon: 'trending-up-feather',
    },
    {
      label: 'الجوائز المسلّمة',
      value: formatGroupedNumber(summary?.deliveredPrizeCount ?? 0),
      note: `من أصل ${formatGroupedNumber(winnerCount)} فائز`,
      icon: 'building',
    },
  ];
}
