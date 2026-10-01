import {
  describeRemainingTime,
  formatStoryMoment,
} from '../../../shared/formatting/story-time-text';
import { formatStoryViews } from '../../../shared/formatting/story-views-text';
import { StoryDetailView } from '../../../shared/models/story-detail-view';
import { STORY_STATUS_LABELS } from '../../../shared/models/story-status';
import { StoryEntry } from '../models/story-entry';

/** Only a story that is still showing counts its time down. */
export function toStoryDetail(story: StoryEntry, now: Date): StoryDetailView {
  const isActive = story.status === 'active';
  return {
    card: {
      story,
      statusLabel: STORY_STATUS_LABELS[story.status],
      remainingText: isActive ? describeRemainingTime(story.expiresAt, now) : null,
    },
    placeName: story.place.name,
    publishedText: formatStoryMoment(story.publishedAt),
    endsText: formatStoryMoment(story.expiresAt),
    viewsText: formatStoryViews(story.viewCount),
  };
}
