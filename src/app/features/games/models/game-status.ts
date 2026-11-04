/** The server works this out from the start time. */
export type GameStatus = 'scheduled' | 'active' | 'finished';

export const GAME_STATUS_LABELS: Record<GameStatus, string> = {
  scheduled: 'مجدولة',
  active: 'نشطة',
  finished: 'منتهية',
};
