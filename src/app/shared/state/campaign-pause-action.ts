import { CampaignStatus } from '../models/campaign-status';
import { CampaignPauseAction } from '../models/campaign-pause-action';

const PAUSE_ACTION_BY_STATUS: Record<CampaignStatus, CampaignPauseAction | null> = {
  active: 'pause',
  scheduled: 'pause',
  paused: 'resume',
  expired: null,
};

/** `null` once the campaign's days are over. */
export function campaignPauseActionFor(status: CampaignStatus): CampaignPauseAction | null {
  return PAUSE_ACTION_BY_STATUS[status];
}
