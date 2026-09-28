import { CurrencyCode } from '../../../shared/money/currency-code';

/** One row of the merchant's "الخدمات و المنتجات" page. */
export interface MerchantProduct {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly currency: CurrencyCode;
  readonly imageUrl: string | null;
  readonly isAvailable: boolean;
  /** An outside ordering app. */
  readonly orderUrl: string | null;
  /** ISO moment of the last change, shown as "منذ أسبوع". */
  readonly updatedAt: string;
}
