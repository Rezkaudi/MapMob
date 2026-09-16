import { OfferScope } from './offer-scope';
import { CampaignStatus } from '../../../shared/models/campaign-status';

/** "حالة العرض" offers these two; "حفظ كمسودة" saves a draft. The server works out the rest by date. */
export type OfferSavedStatus = Extract<CampaignStatus, 'active' | 'paused' | 'draft'>;

/** What the add and edit forms send. */
export interface OfferDraft {
  readonly title: string;
  readonly discountPercent: number;
  readonly placeId: string;
  readonly categoryName: string;
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
