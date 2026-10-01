import {
  STORY_NOW,
  buildExpiredStoryEntry,
  buildHiddenStoryEntry,
  buildStoryEntry,
} from '../testing/story-fixture';
import { toStoryDetail } from './story-detail';

describe('toStoryDetail', () => {
  it('writes the drawer of an active story, with the time it has left', () => {
    const story = buildStoryEntry({ viewCount: 125 });

    expect(toStoryDetail(story, STORY_NOW)).toEqual({
      card: { story, statusLabel: 'نشطة', remainingText: 'متبقي 14 ساعة' },
      placeName: 'صيدلية الشفاء',
      publishedText: '01/10/2026 - 10:30',
      endsText: '02/10/2026 - 10:30',
      viewsText: '125 مشاهدة',
    });
  });

  it('counts no time down for a hidden or an expired story', () => {
    const hidden = toStoryDetail(buildHiddenStoryEntry(), STORY_NOW);
    const expired = toStoryDetail(buildExpiredStoryEntry(), STORY_NOW);

    expect([hidden.card.statusLabel, hidden.card.remainingText]).toEqual(['مخفية', null]);
    expect([expired.card.statusLabel, expired.card.remainingText]).toEqual(['منتهية', null]);
  });
});
