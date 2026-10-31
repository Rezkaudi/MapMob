import { StoryMediaKind } from '../../../shared/models/story-media-kind';
import { MerchantStory } from '../models/merchant-story';
import { LiveOwnerStory } from './live-owner-story';

const ACTIVE_STATUS = 'active';
const VIDEO_KIND: StoryMediaKind = 'video';

// The owner page has no hidden state, so a story an admin hid shows as ended.
export function toMerchantStory(story: LiveOwnerStory): MerchantStory {
  return {
    id: String(story.id),
    kind: story.type === VIDEO_KIND ? 'video' : 'image',
    url: story.url,
    posterUrl: null,
    caption: story.caption,
    status: story.status === ACTIVE_STATUS ? 'active' : 'expired',
    publishedAt: story.createdAt,
    expiresAt: story.expiresAt,
    // The server does not count story views yet.
    viewCount: 0,
  };
}
