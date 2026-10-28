import { LivePrize } from './live-prize';

interface LiveWinnerUser {
  readonly id: number;
  readonly name: string;
  readonly phone?: string | null;
  readonly email?: string | null;
}

/** The server has had no winner yet, so every field but the id is read with care. */
export interface LiveWinner {
  readonly id: number;
  readonly game?: { readonly id: number; readonly name: string } | null;
  readonly game_id?: number;
  readonly user?: LiveWinnerUser | null;
  readonly prize?: LivePrize | null;
  readonly delivery_status?: string | null;
  readonly created_at?: string | null;
}
