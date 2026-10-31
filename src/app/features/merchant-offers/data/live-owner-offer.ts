import { LiveOptionalText } from '../../../shared/data/arabic-text-of';

/** A row of GET /owner/offers. The list sends `title` as one string, in English when there is one. */
export interface LiveOwnerOffer {
  readonly id: string;
  readonly productId: string | null;
  readonly scope: { readonly type: string; readonly productId: string | null };
  readonly title: string | LiveOptionalText;
  readonly description: string | null;
  readonly imageUrl: string | null;
  readonly discountPercentage: number | null;
  readonly startsAt: string;
  readonly endsAt: string;
  /** `active` or `inactive`; the days decide scheduled and expired. */
  readonly status: string;
  readonly createdAt: string;
}
