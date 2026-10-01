import {
  buildExpiredStoryEntry,
  buildHiddenStoryEntry,
  buildStoryEntry,
} from '../testing/story-fixture';
import { toStoryRow } from './story-row';

describe('toStoryRow', () => {
  it('writes an active row: green pill, grouped views, and a story that can be hidden', () => {
    const story = buildStoryEntry({ viewCount: 1240 });

    expect(toStoryRow(story)).toEqual({
      story,
      thumbnailUrl: 'https://cdn.example.com/story-1.jpg',
      statusLabel: 'نشطة',
      pillClass: 'bg-status-success',
      viewsText: '1,240',
      visibilityAction: 'hide',
    });
  });

  it('paints a hidden story amber and offers to show it again', () => {
    const row = toStoryRow(buildHiddenStoryEntry());

    expect([row.statusLabel, row.pillClass, row.visibilityAction]).toEqual([
      'مخفية',
      'bg-accent',
      'show',
    ]);
  });

  it('paints an expired story grey, with nothing left to hide or show', () => {
    const row = toStoryRow(buildExpiredStoryEntry());

    expect([row.statusLabel, row.pillClass, row.visibilityAction]).toEqual([
      'منتهية',
      'bg-[#94a3b8]',
      null,
    ]);
  });

  it('shows the still frame of a video, or nothing until the server has one', () => {
    const video = buildStoryEntry({ kind: 'video', url: 'https://cdn.example.com/s.mp4' });

    expect(toStoryRow(video).thumbnailUrl).toBeNull();
    expect(toStoryRow({ ...video, posterUrl: 'https://cdn.example.com/s.jpg' }).thumbnailUrl).toBe(
      'https://cdn.example.com/s.jpg',
    );
  });
});
