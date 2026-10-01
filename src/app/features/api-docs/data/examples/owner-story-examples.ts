import type { MerchantStory } from '../../../merchant-stories/models/merchant-story';
import type { MerchantStoryLibrary } from '../../../merchant-stories/models/merchant-story-library';

export const OWNER_STORY = {
  id: '58',
  kind: 'image',
  url: 'https://cdn.mapmob.sy/storage/places/7/stories/58.jpg',
  posterUrl: null,
  caption: 'وصول دفعة سيرومات فيتامين C الجديدة',
  status: 'active',
  publishedAt: '2026-10-01T07:30:00Z',
  expiresAt: '2026-10-02T07:30:00Z',
  viewCount: 348,
} satisfies MerchantStory;

export const OWNER_STORY_LIBRARY = {
  plan: { id: '1', name: 'الباقة المجانية' },
  place: { id: '7', name: 'صيدلية الشفاء' },
  activeStoryLimit: 5,
  items: [
    OWNER_STORY,
    {
      id: '41',
      kind: 'video',
      url: 'https://cdn.mapmob.sy/storage/places/7/stories/41.mp4',
      posterUrl: 'https://cdn.mapmob.sy/storage/places/7/stories/41-poster.jpg',
      caption: null,
      status: 'expired',
      publishedAt: '2026-09-18T11:00:00Z',
      expiresAt: '2026-09-19T11:00:00Z',
      viewCount: 680,
    },
  ],
} satisfies MerchantStoryLibrary;

export const OWNER_STORY_FORM = {
  file: '@serum.jpg',
  caption: 'وصول دفعة سيرومات فيتامين C الجديدة',
};

export const OWNER_STORY_EDIT_FORM = {
  caption: 'وصول دفعة سيرومات فيتامين C الجديدة، الكمية محدودة',
};
