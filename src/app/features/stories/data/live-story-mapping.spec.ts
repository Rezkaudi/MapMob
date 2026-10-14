import { LIVE_STORY } from '../testing/live-story-fixture';
import { toStoryEntry, toStorySummary } from './live-story-mapping';

describe('live story mapping', () => {
  it('reads a story row, ending one day after it went up', () => {
    expect(toStoryEntry(LIVE_STORY)).toEqual({
      id: '2',
      kind: 'image',
      url: 'https://api.test/storage/stores/1/media/a.jpg',
      posterUrl: null,
      caption: null,
      place: { id: '1', name: 'متجر دمشق' },
      status: 'expired',
      publishedAt: '2026-10-04T20:26:59.000Z',
      expiresAt: '2026-10-05T20:26:59.000Z',
      viewCount: 0,
    });
  });

  it('reads a video and an unknown status as active', () => {
    const story = toStoryEntry({ ...LIVE_STORY, type: 'video', status: 'live' });

    expect(story.kind).toBe('video');
    expect(story.status).toBe('active');
  });

  it('reads the summary, with no view count on the server', () => {
    expect(toStorySummary({ total: 2, active: 0, hidden: 1, expired: 1 })).toEqual({
      storyCount: 2,
      activeCount: 0,
      hiddenCount: 1,
      expiredCount: 1,
      viewCount: 0,
    });
  });
});
