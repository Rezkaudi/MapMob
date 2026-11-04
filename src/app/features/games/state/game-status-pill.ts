import { GameStatus } from '../models/game-status';

/** Scheduled and finished come from the frames; active follows the app's other pills. */
export const GAME_STATUS_PILL_CLASSES: Record<GameStatus, string> = {
  scheduled: 'bg-accent',
  active: 'bg-status-success',
  finished: 'bg-closed',
};

/** A finished game keeps its record: it can be viewed, not edited or deleted. */
export function canChangeGame(status: GameStatus): boolean {
  return status !== 'finished';
}
