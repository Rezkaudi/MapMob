import { AdPauseAction } from './ad-pause-action';

/** What the confirm dialog of the ads page is about to save. */
export type AdConfirmAction = AdPauseAction | 'delete';
