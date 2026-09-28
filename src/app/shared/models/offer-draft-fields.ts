import { OfferSavedStatus } from './offer-saved-status';
import { OfferScope } from './offer-scope';

/** What every offer form sends, admin or place owner. */
export interface OfferDraftFields {
  readonly title: string;
  readonly discountPercent: number;
  /** Calendar days written `yyyy-mm-dd`. */
  readonly startsOn: string;
  readonly endsOn: string;
  readonly status: OfferSavedStatus;
  readonly description: string;
  readonly scope: OfferScope;
  /** Only read when the scope is `selectedItems`. */
  readonly itemIds: readonly string[];
  /** A newly picked picture; `null` keeps the saved one unless `isImageRemoved`. */
  readonly image: File | null;
  readonly isImageRemoved: boolean;
}
