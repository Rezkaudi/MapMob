import { MerchantStory } from '../models/merchant-story';
import { StoryDetailView } from '../models/story-detail-view';
import { toStoryCard } from './story-card-view';
import { formatStoryMoment } from './story-time-text';

export function toStoryDetail(story: MerchantStory, placeName: string, now: Date): StoryDetailView {
  return {
    card: toStoryCard(story, now),
    placeName,
    publishedText: formatStoryMoment(story.publishedAt),
    endsText: formatStoryMoment(story.expiresAt),
  };
}
