import { formatStoryMoment } from '../../../shared/formatting/story-time-text';
import { MerchantStory } from '../models/merchant-story';
import { MerchantStoryDetail } from '../models/merchant-story-detail';
import { toStoryCard } from './story-card-view';

export function toStoryDetail(
  story: MerchantStory,
  placeName: string,
  now: Date,
): MerchantStoryDetail {
  const card = toStoryCard(story, now);
  return {
    card,
    viewsText: card.viewsText,
    placeName,
    publishedText: formatStoryMoment(story.publishedAt),
    endsText: formatStoryMoment(story.expiresAt),
  };
}
