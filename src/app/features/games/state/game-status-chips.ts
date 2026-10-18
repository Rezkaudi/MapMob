import { ChipOption } from '../../../shared/ui/filter-chips/chip-option';
import { GAME_STATUS_LABELS } from '../models/game-status';
import { GameSummary } from '../models/game-summary';

export const ALL_GAMES_CHIP = 'all';
const ALL_GAMES_LABEL = 'الكل';

/** The frame offers only these two statuses, with a green and a red dot. */
export function buildGameStatusChips(summary: GameSummary | null): readonly ChipOption[] {
  return [
    { value: ALL_GAMES_CHIP, label: ALL_GAMES_LABEL, count: summary?.gameCount ?? 0 },
    {
      value: 'scheduled',
      label: GAME_STATUS_LABELS.scheduled,
      count: summary?.scheduledCount ?? 0,
      dotClass: 'bg-status-success',
    },
    {
      value: 'finished',
      label: GAME_STATUS_LABELS.finished,
      count: summary?.finishedCount ?? 0,
      dotClass: 'bg-closed',
    },
  ];
}
