import type { StoryEntry } from '../../../stories/models/story-entry';
import type { StoryPage } from '../../../stories/models/story-page';
import type { StorySummary } from '../../../stories/models/story-summary';

export const STORY_ROW = {
  id: '58',
  place: { id: '7', name: 'صيدلية الشفاء' },
  kind: 'image',
  url: 'https://cdn.mapmob.sy/storage/places/7/stories/58.jpg',
  posterUrl: null,
  caption: 'وصول دفعة سيرومات فيتامين C الجديدة',
  status: 'active',
  publishedAt: '2026-10-01T07:30:00Z',
  expiresAt: '2026-10-02T07:30:00Z',
  viewCount: 842,
} satisfies StoryEntry;

export const STORY_PAGE = {
  items: [
    STORY_ROW,
    {
      id: '41',
      place: { id: '12', name: 'كافيه ورد' },
      kind: 'video',
      url: 'https://cdn.mapmob.sy/storage/places/12/stories/41.mp4',
      posterUrl: 'https://cdn.mapmob.sy/storage/places/12/stories/41-poster.jpg',
      caption: null,
      status: 'hidden',
      publishedAt: '2026-10-01T05:00:00Z',
      expiresAt: '2026-10-02T05:00:00Z',
      viewCount: 124,
    },
  ],
  totalCount: 124,
} satisfies StoryPage;

export const STORY_SUMMARY = {
  storyCount: 124,
  activeCount: 10,
  hiddenCount: 1,
  expiredCount: 113,
  viewCount: 1200,
} satisfies StorySummary;
