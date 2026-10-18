import { GameEntry } from './game-entry';

export interface GameRow {
  readonly game: GameEntry;
  readonly roundLabel: string;
  readonly dayText: string;
  readonly timeText: string;
  readonly prizeText: string;
  readonly participantsText: string;
  readonly statusLabel: string;
  readonly pillClass: string;
  readonly canChange: boolean;
}
