import { CampaignStatus } from '../models/campaign-status';

export type RunningCampaignStatus = Extract<CampaignStatus, 'scheduled' | 'active' | 'expired'>;

interface CampaignDays {
  /** Calendar days written `yyyy-mm-dd`; `null` has no last day. */
  readonly startsOn: string;
  readonly endsOn: string | null;
}

/** The status a campaign that is neither paused nor a draft has on `today` (`yyyy-mm-dd`). */
export function resolveRunningStatus(days: CampaignDays, today: string): RunningCampaignStatus {
  if (today < days.startsOn) {
    return 'scheduled';
  }
  return days.endsOn !== null && today > days.endsOn ? 'expired' : 'active';
}
