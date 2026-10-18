import { formatGroupedNumber } from '../../../shared/formatting/grouped-number';
import { GameEntry } from '../models/game-entry';
import { GameRow } from '../models/game-row';
import { GAME_STATUS_LABELS } from '../models/game-status';
import { formatGameDay, formatGameTwelveHourTime } from './game-schedule-text';
import { GAME_STATUS_PILL_CLASSES, canChangeGame } from './game-status-pill';
import { formatRoundLabel } from './game-title';
import { formatPrizeValue } from './prize-text';

export function toGameRow(game: GameEntry): GameRow {
  return {
    game,
    roundLabel: formatRoundLabel(game),
    dayText: formatGameDay(game.startsAt, game.timeZone),
    timeText: formatGameTwelveHourTime(game.startsAt, game.timeZone),
    prizeText: formatPrizeValue(game.prize.value),
    participantsText: formatGroupedNumber(game.participantCount),
    statusLabel: GAME_STATUS_LABELS[game.status],
    pillClass: GAME_STATUS_PILL_CLASSES[game.status],
    canChange: canChangeGame(game.status),
  };
}
