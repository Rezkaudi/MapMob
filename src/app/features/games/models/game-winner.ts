import { NamedReference } from '../../../shared/models/named-reference';
import { GameReference } from './game-reference';
import { PrizeDeliveryStatus } from './prize-delivery-status';
import { WonPrize } from './won-prize';

export interface GameWinner {
  readonly id: string;
  readonly game: GameReference;
  readonly user: NamedReference;
  readonly phone: string | null;
  readonly email: string | null;
  readonly prize: WonPrize;
  /** yyyy-mm-dd. */
  readonly wonOn: string;
  readonly deliveryStatus: PrizeDeliveryStatus;
}
