import { CampaignStatus } from '../../../shared/models/campaign-status';
import { AdPauseAction } from '../models/ad-pause-action';

const PAUSE_ACTION_BY_STATUS: Record<CampaignStatus, AdPauseAction | null> = {
  active: 'pause',
  scheduled: 'pause',
  paused: 'resume',
  expired: null,
  draft: null,
};

/** `null` once the ad's days are over, or while it is still a draft. */
export function adPauseActionFor(status: CampaignStatus): AdPauseAction | null {
  return PAUSE_ACTION_BY_STATUS[status];
}
