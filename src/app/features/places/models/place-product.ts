import { CurrencyCode } from '../../../shared/money/currency-code';

export interface PlaceProduct {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  /** The currency the price is in, picked beside the price field. */
  readonly currency: CurrencyCode;
  readonly imageUrl: string;
  readonly isAvailable: boolean;
  /** Sends the visitor to an external ordering platform. Empty when there is none. */
  readonly orderUrl: string;
}
