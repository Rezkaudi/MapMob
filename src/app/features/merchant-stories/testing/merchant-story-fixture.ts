import { MerchantStory } from '../models/merchant-story';
import { MerchantStoryLibrary } from '../models/merchant-story-library';

/** Local time, so the specs read the same in every time zone. */
export const STORY_NOW = new Date(2026, 9, 1, 20, 30);

export function buildStory(overrides: Partial<MerchantStory> = {}): MerchantStory {
  return {
    id: 'story-1',
    kind: 'image',
    url: 'https://cdn.example.com/story-1.jpg',
    posterUrl: null,
    caption: 'وصول دفعة سيرومات فيتامين C الجديدة',
    status: 'active',
    publishedAt: new Date(2026, 9, 1, 10, 30).toISOString(),
    expiresAt: new Date(2026, 9, 2, 10, 30).toISOString(),
    viewCount: 348,
    ...overrides,
  };
}

export function buildExpiredStory(overrides: Partial<MerchantStory> = {}): MerchantStory {
  return buildStory({
    id: 'story-expired',
    caption: 'عرض نهاية الأسبوع على المرطبات الطبية',
    status: 'expired',
    publishedAt: new Date(2026, 8, 18, 14, 0).toISOString(),
    expiresAt: new Date(2026, 8, 19, 14, 0).toISOString(),
    viewCount: 680,
    ...overrides,
  });
}

export function buildStoryLibrary(
  overrides: Partial<MerchantStoryLibrary> = {},
): MerchantStoryLibrary {
  return {
    plan: { id: 'plan-free', name: 'الباقة المجانية' },
    place: { id: 'place-1', name: 'صيدلية الشفاء' },
    activeStoryLimit: 5,
    items: [buildStory(), buildExpiredStory()],
    ...overrides,
  };
}
