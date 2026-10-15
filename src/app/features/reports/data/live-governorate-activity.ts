import { LiveReference } from '../../../core/http/live-reference';

/** One row of `/admin/reports/governorateactivity`. */
export interface LiveGovernorateActivity {
  readonly governorate: LiveReference;
  readonly visitCount: number;
  readonly sharePercent: number;
}
