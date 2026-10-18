import { Money } from '../../../shared/money/money';
import { PrizeKind } from './prize-kind';

export interface GamePrize {
  readonly kind: PrizeKind;
  /** The whole amount set aside for the game's winners. */
  readonly value: Money;
  /** The place that gives a voucher; `null` for a cash prize. */
  readonly sponsorName: string | null;
  readonly maxWinnerCount: number;
}
