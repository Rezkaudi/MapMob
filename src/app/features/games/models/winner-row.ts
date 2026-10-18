import { GameWinner } from './game-winner';

export interface WinnerRow {
  readonly winner: GameWinner;
  readonly contactText: string;
  readonly roundText: string;
  /** The page table writes the amount alone; a voucher is named by who gives it. */
  readonly prizeText: string;
  /** The detail modal spells the cash prize out. */
  readonly prizeSentence: string;
  readonly wonOnText: string;
  readonly statusLabel: string;
  readonly pillClass: string;
}
