import { LiveReference } from '../../../core/http/live-reference';

/** One row of `/admin/reports/categoryshares`. */
export interface LiveCategoryShare {
  readonly category: LiveReference;
  readonly placeCount: number;
  readonly sharePercent: number;
}
