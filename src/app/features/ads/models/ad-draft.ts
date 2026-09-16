import { CampaignStatus } from '../../../shared/models/campaign-status';
import { AdAdvertiserType } from './ad-advertiser-type';
import { AdContentType } from './ad-content-type';
import { AdPlacement } from './ad-placement';
import { AdPosition } from './ad-position';
import { AdPriority } from './ad-priority';

/** "حالة الإعلان الأولية" offers the first two; "حفظ كمسودة" saves a draft. */
export type AdSavedStatus = Extract<CampaignStatus, 'active' | 'paused' | 'draft'>;

/** What the add and edit forms send. */
export interface AdDraft {
  readonly title: string;
  readonly advertiserType: AdAdvertiserType;
  /** Only read for a store's ad. */
  readonly placeId: string | null;
  readonly contentType: AdContentType;
  readonly text: string;
  readonly placement: AdPlacement;
  readonly position: AdPosition;
  /** Calendar days written `yyyy-mm-dd`; `endsOn` is `null` for an ad that never ends. */
  readonly startsOn: string;
  readonly endsOn: string | null;
  readonly priority: AdPriority;
  readonly status: AdSavedStatus;
  /** A newly picked picture or video; `null` keeps the saved one unless `isMediaRemoved`. */
  readonly media: File | null;
  readonly isMediaRemoved: boolean;
}
