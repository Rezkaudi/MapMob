import { ActivationStatus } from '../../../shared/models/activation-status';
import { MerchantProduct } from './merchant-product';

/** A product as the table prints it. */
export interface ProductTableRow {
  readonly product: MerchantProduct;
  /** Stands in for a missing picture on the orange tile. */
  readonly initial: string;
  readonly priceText: string;
  readonly updatedText: string;
  readonly status: ActivationStatus;
  readonly statusLabel: string;
}
