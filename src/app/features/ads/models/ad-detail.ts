import { Ad } from './ad';
import { AdPosition } from './ad-position';

/** Everything the edit form needs beyond the table row. */
export interface AdDetail {
  readonly ad: Ad;
  /** `null` for an ad the app's own team runs. */
  readonly placeId: string | null;
  readonly position: AdPosition;
  readonly text: string;
  readonly mediaUrl: string | null;
}
