import { Money } from '../../../shared/money/money';
import { PrizeKind } from './prize-kind';

/** The share of the game's prize one winner gets. */
export interface WonPrize {
  readonly kind: PrizeKind;
  readonly value: Money;
  readonly sponsorName: string | null;
}
