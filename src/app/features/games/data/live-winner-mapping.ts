import { GameEntry } from '../models/game-entry';
import { GameReference } from '../models/game-reference';
import { GameWinner } from '../models/game-winner';
import { WonPrize } from '../models/won-prize';
import { LiveWinner } from './live-winner';
import { toWonPrize } from './live-prize-mapping';

const CALENDAR_DAY_LENGTH = 'yyyy-mm-dd'.length;

function findGame(winner: LiveWinner, games: readonly GameEntry[]): GameEntry | undefined {
  const gameId = String(winner.game?.id ?? winner.game_id ?? '');
  return games.find((game) => game.id === gameId);
}

function toGameReference(winner: LiveWinner, game: GameEntry | undefined): GameReference {
  const gameId = winner.game?.id ?? winner.game_id ?? 0;
  return {
    id: String(gameId),
    name: winner.game?.name ?? game?.name ?? '',
    roundNumber: game?.roundNumber ?? gameId,
  };
}

function toPrize(winner: LiveWinner, game: GameEntry | undefined): WonPrize {
  if (winner.prize) {
    return toWonPrize(winner.prize);
  }
  const { kind, value, sponsorName } = game?.prize ?? {
    kind: 'cash',
    value: { amount: 0, currency: 'SYP' },
    sponsorName: null,
  };
  return { kind, value, sponsorName };
}

/** `games` supplies what a winner row leaves out: the game name, round and prize. */
export function toGameWinner(winner: LiveWinner, games: readonly GameEntry[]): GameWinner {
  const game = findGame(winner, games);
  return {
    id: String(winner.id),
    game: toGameReference(winner, game),
    user: { id: String(winner.user?.id ?? ''), name: winner.user?.name ?? '' },
    phone: winner.user?.phone ?? null,
    email: winner.user?.email ?? null,
    prize: toPrize(winner, game),
    wonOn: (winner.created_at ?? '').slice(0, CALENDAR_DAY_LENGTH),
    deliveryStatus: winner.delivery_status === 'delivered' ? 'delivered' : 'pending',
  };
}
