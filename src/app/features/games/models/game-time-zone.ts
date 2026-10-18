export interface GameTimeZone {
  readonly id: string;
  readonly label: string;
  /** Damascus has kept one offset all year since 2022, so a fixed offset is exact. */
  readonly utcOffset: string;
}

export const GAME_TIME_ZONES: readonly GameTimeZone[] = [
  { id: 'Asia/Damascus', label: 'توقيت دمشق (GMT+3)', utcOffset: '+03:00' },
];

export const DEFAULT_GAME_TIME_ZONE = GAME_TIME_ZONES[0];
