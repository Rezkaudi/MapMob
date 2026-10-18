import { GameEntry } from '../models/game-entry';
import { GAME_STATUS_LABELS } from '../models/game-status';
import { UpcomingGameView } from '../models/upcoming-game-view';
import { describeGameCountdown, formatGameClock, formatGameDay } from './game-schedule-text';
import { formatGameTitle } from './game-title';
import { describeBannerPrize } from './prize-text';

const UPCOMING_WORDS = 'اللعبة القادمة';

export function toUpcomingGameView(game: GameEntry, now: Date): UpcomingGameView {
  const { startsAt, timeZone } = game;
  const day = formatGameDay(startsAt, timeZone);
  const clock = formatGameClock(startsAt, timeZone);
  const countdown = describeGameCountdown(startsAt, now, timeZone);
  return {
    gameId: game.id,
    statusText: `${UPCOMING_WORDS} • ${GAME_STATUS_LABELS[game.status]}`,
    title: formatGameTitle(game),
    scheduleText: `${day} — ${clock} (${countdown})`,
    prizeText: describeBannerPrize(game.prize),
  };
}
