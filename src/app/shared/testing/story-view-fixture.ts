import { StoryDetailView } from '../models/story-detail-view';
import { StoryPicture } from '../models/story-picture';
import { StoryVisualCard } from '../models/story-visual-card';

export function buildStoryPicture(overrides: Partial<StoryPicture> = {}): StoryPicture {
  return {
    kind: 'image',
    url: 'https://cdn.example.com/story-1.jpg',
    posterUrl: null,
    caption: 'وصول دفعة سيرومات فيتامين C الجديدة',
    ...overrides,
  };
}

export function buildStoryVisualCard(
  overrides: Partial<StoryVisualCard> = {},
  picture: Partial<StoryPicture> = {},
): StoryVisualCard {
  return {
    story: { ...buildStoryPicture(picture), status: 'active' },
    statusLabel: 'نشطة',
    remainingText: 'متبقي 14 ساعة',
    ...overrides,
  };
}

export function buildExpiredStoryVisualCard(picture: Partial<StoryPicture> = {}): StoryVisualCard {
  return {
    story: { ...buildStoryPicture(picture), status: 'expired' },
    statusLabel: 'منتهية',
    remainingText: null,
  };
}

export function buildHiddenStoryVisualCard(): StoryVisualCard {
  return {
    story: { ...buildStoryPicture(), status: 'hidden' },
    statusLabel: 'مخفية',
    remainingText: null,
  };
}

export function buildStoryDetailView(overrides: Partial<StoryDetailView> = {}): StoryDetailView {
  return {
    card: buildStoryVisualCard(),
    placeName: 'صيدلية الشفاء',
    publishedText: '01/10/2026 - 10:30',
    endsText: '02/10/2026 - 10:30',
    viewsText: '125 مشاهدة',
    ...overrides,
  };
}
