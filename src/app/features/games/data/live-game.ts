import { LivePrize } from './live-prize';

export type LiveGameStatus = 'draft' | 'scheduled' | 'active' | 'completed';

export interface LiveGameOption {
  readonly id: number;
  readonly option: string;
  readonly is_correct: boolean;
  readonly sort_order: number;
}

export interface LiveGameQuestion {
  readonly id: number;
  readonly question: string;
  readonly sort_order: number;
  readonly options: readonly LiveGameOption[];
}

/** A game as `/admin/games` sends it; numbers may come back as strings right after a save. */
export interface LiveGame {
  readonly id: number;
  readonly name: string;
  readonly description: string | null;
  /** ISO moment in UTC. */
  readonly starts_at: string;
  readonly ends_at: string | null;
  readonly timezone: string;
  readonly answer_time_seconds: number | string;
  readonly status: LiveGameStatus;
  readonly prize: LivePrize;
  readonly max_winners: number | string;
  /** The list sends a count; the detail sends the questions. */
  readonly questions_count?: number;
  readonly questions?: readonly LiveGameQuestion[];
  readonly winners_count?: number;
}
