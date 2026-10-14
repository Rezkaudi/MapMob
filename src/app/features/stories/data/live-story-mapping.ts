import { StoryStatus } from '../../../shared/models/story-status';
import { StoryEntry } from '../models/story-entry';
import { StorySummary } from '../models/story-summary';
import { LiveStory } from './live-story';

const STORY_LIFE_MS = 24 * 60 * 60 * 1000;
const VIDEO_TYPE = 'video';
// The server keeps no view count for stories.
const NO_VIEWS = 0;

export interface LiveStorySummary {
  readonly total: number;
  readonly active: number;
  readonly hidden: number;
  readonly expired: number;
}

function toStoryStatus(liveStatus: string): StoryStatus {
  return liveStatus === 'hidden' || liveStatus === 'expired' ? liveStatus : 'active';
}

export function toStoryEntry(story: LiveStory): StoryEntry {
  const publishedAt = new Date(story.created_at);
  return {
    id: String(story.id),
    kind: story.type === VIDEO_TYPE ? 'video' : 'image',
    url: story.url,
    posterUrl: null,
    caption: null,
    place: { id: String(story.store.id), name: story.store.name },
    status: toStoryStatus(story.status),
    publishedAt: publishedAt.toISOString(),
    expiresAt: new Date(publishedAt.getTime() + STORY_LIFE_MS).toISOString(),
    viewCount: NO_VIEWS,
  };
}

export function toStorySummary(summary: LiveStorySummary): StorySummary {
  return {
    storyCount: summary.total,
    activeCount: summary.active,
    hiddenCount: summary.hidden,
    expiredCount: summary.expired,
    viewCount: NO_VIEWS,
  };
}
