import { GameStatus } from '../models/game-status';

/** Scheduled and finished come from the frames; active and draft follow the app's other pills. */
export const GAME_STATUS_PILL_CLASSES: Record<GameStatus, string> = {
  draft: 'bg-[#94a3b8]',
  scheduled: 'bg-accent',
  active: 'bg-status-success',
  finished: 'bg-closed',
};

/** A finished game keeps its record: it can be viewed, not edited or deleted. */
export function canChangeGame(status: GameStatus): boolean {
  return status !== 'finished';
}
