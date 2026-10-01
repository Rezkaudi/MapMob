import { StoryStatus } from '../../../shared/models/story-status';

/** The owner's list only tells a running story from one that has run out. */
export type MerchantStoryStatus = Exclude<StoryStatus, 'hidden'>;
