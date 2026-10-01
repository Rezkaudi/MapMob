import { StoryEntry } from '../models/story-entry';
import { StorySummary } from '../models/story-summary';

/** Local time, so the specs read the same in every time zone. */
export const STORY_NOW = new Date(2026, 9, 1, 20, 30);

export function buildStoryEntry(overrides: Partial<StoryEntry> = {}): StoryEntry {
  return {
    id: 'story-1',
    place: { id: 'place-1', name: 'صيدلية الشفاء' },
    kind: 'image',
    url: 'https://cdn.example.com/story-1.jpg',
    posterUrl: null,
    caption: 'وصول دفعة سيرومات فيتامين C الجديدة',
    status: 'active',
    publishedAt: new Date(2026, 9, 1, 10, 30).toISOString(),
    expiresAt: new Date(2026, 9, 2, 10, 30).toISOString(),
    viewCount: 842,
    ...overrides,
  };
}

export function buildHiddenStoryEntry(overrides: Partial<StoryEntry> = {}): StoryEntry {
  return buildStoryEntry({ id: 'story-hidden', status: 'hidden', ...overrides });
}

export function buildExpiredStoryEntry(overrides: Partial<StoryEntry> = {}): StoryEntry {
  return buildStoryEntry({
    id: 'story-expired',
    place: { id: 'place-4', name: 'كافيه ورد' },
    status: 'expired',
    publishedAt: new Date(2026, 8, 18, 14, 0).toISOString(),
    expiresAt: new Date(2026, 8, 19, 14, 0).toISOString(),
    viewCount: 124,
    ...overrides,
  });
}

export function buildStorySummary(overrides: Partial<StorySummary> = {}): StorySummary {
  return {
    storyCount: 124,
    activeCount: 10,
    hiddenCount: 1,
    expiredCount: 21,
    viewCount: 1200,
    ...overrides,
  };
}
