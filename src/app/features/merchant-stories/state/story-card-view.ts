import {
  describeRemainingTime,
  formatStoryDayTime,
  formatStoryPublishedTime,
} from '../../../shared/formatting/story-time-text';
import { formatStoryViews } from '../../../shared/formatting/story-views-text';
import { STORY_STATUS_LABELS } from '../../../shared/models/story-status';
import { MerchantStory } from '../models/merchant-story';
import { StoryCardView } from '../models/story-card-view';

export function toStoryCard(story: MerchantStory, now: Date): StoryCardView {
  const isActive = story.status === 'active';
  return {
    story,
    isActive,
    isVideo: story.kind === 'video',
    statusLabel: STORY_STATUS_LABELS[story.status],
    remainingText: isActive ? describeRemainingTime(story.expiresAt, now) : null,
    publishedText: isActive
      ? formatStoryPublishedTime(story.publishedAt, now)
      : formatStoryDayTime(story.publishedAt),
    endedText: formatStoryDayTime(story.expiresAt),
    viewsText: formatStoryViews(story.viewCount),
  };
}
