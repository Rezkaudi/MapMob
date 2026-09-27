import { Ad } from './ad';
import { AdMetrics } from './ad-metrics';
import { AdPosition } from './ad-position';

/** Everything the detail page and the edit form need beyond the table row. */
export interface AdDetail {
  readonly ad: Ad;
  /** `null` for an ad the app's own team runs. */
  readonly placeId: string | null;
  readonly position: AdPosition;
  readonly text: string;
  readonly mediaUrl: string | null;
  /** Calendar days written `yyyy-mm-dd`. */
  readonly createdOn: string;
  readonly updatedOn: string;
  /** The name shown beside the last change, "Admin" for the app's own team. */
  readonly updatedBy: string;
  readonly metrics: AdMetrics;
}
