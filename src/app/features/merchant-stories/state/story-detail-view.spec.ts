import { STORY_NOW, buildStory } from '../testing/merchant-story-fixture';
import { toStoryDetail } from './story-detail-view';

describe('toStoryDetail', () => {
  it('writes the rows of the drawer', () => {
    const story = buildStory({
      publishedAt: new Date(2026, 8, 30, 22, 30).toISOString(),
      expiresAt: new Date(2026, 9, 1, 22, 30).toISOString(),
    });

    const detail = toStoryDetail(story, 'صيدلية الشفاء', STORY_NOW);

    expect(detail.placeName).toBe('صيدلية الشفاء');
    expect(detail.publishedText).toBe('30/09/2026 - 22:30');
    expect(detail.endsText).toBe('01/10/2026 - 22:30');
    expect(detail.viewsText).toBe('348 مشاهدة');
    expect(detail.card.statusLabel).toBe('نشطة');
    expect(detail.card.remainingText).toBe('متبقي ساعتان');
  });
});
