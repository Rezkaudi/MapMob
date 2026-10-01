import { MerchantStory } from '../models/merchant-story';
import { StoryCardView } from '../models/story-card-view';
import { StoryStatus } from '../models/story-status';
import {
  describeRemainingTime,
  formatStoryDayTime,
  formatStoryPublishedTime,
} from './story-time-text';
import { formatStoryViews } from './story-views-text';

const STATUS_LABELS: Record<StoryStatus, string> = { active: 'نشطة', expired: 'منتهية' };

export function toStoryCard(story: MerchantStory, now: Date): StoryCardView {
  const isActive = story.status === 'active';
  return {
    story,
    isActive,
    isVideo: story.kind === 'video',
    statusLabel: STATUS_LABELS[story.status],
    remainingText: isActive ? describeRemainingTime(story.expiresAt, now) : null,
    publishedText: isActive
      ? formatStoryPublishedTime(story.publishedAt, now)
      : formatStoryDayTime(story.publishedAt),
    endedText: formatStoryDayTime(story.expiresAt),
    viewsText: formatStoryViews(story.viewCount),
  };
}
