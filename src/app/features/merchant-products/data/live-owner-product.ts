import { LiveOptionalText } from '../../../shared/data/arabic-text-of';

/** A row of GET /owner/products. */
export interface LiveOwnerProduct {
  readonly id: string;
  readonly name: LiveOptionalText;
  readonly price: number;
  /** Comes back as sent: `syp` and `SYP` both occur. */
  readonly currencyCode: string;
  readonly imageUrl: string | null;
  readonly status: string;
  readonly updatedAt: string;
}
