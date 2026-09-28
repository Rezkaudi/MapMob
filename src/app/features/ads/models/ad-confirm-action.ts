import { CampaignPauseAction } from '../../../shared/models/campaign-pause-action';

/** What the confirm dialog of the ads page is about to save. */
export type AdConfirmAction = CampaignPauseAction | 'delete';
