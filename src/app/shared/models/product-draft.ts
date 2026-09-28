import { CurrencyCode } from '../money/currency-code';

/** What the add-product dialog collects before an id is assigned. */
export interface ProductDraft {
  readonly name: string;
  readonly price: number;
  readonly currency: CurrencyCode;
  readonly isAvailable: boolean;
  readonly imageUrl: string;
  /** The picture picked in this dialog, for upload. null keeps the saved one or none. */
  readonly imageFile: File | null;
  readonly orderUrl: string;
}
