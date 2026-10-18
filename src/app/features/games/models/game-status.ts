/** The server works this out from the start time; a draft stays a draft until it is published. */
export type GameStatus = 'draft' | 'scheduled' | 'active' | 'finished';

export const GAME_STATUS_LABELS: Record<GameStatus, string> = {
  draft: 'مسودة',
  scheduled: 'مجدولة',
  active: 'نشطة',
  finished: 'منتهية',
};
