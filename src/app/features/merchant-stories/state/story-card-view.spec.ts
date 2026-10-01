import { STORY_NOW, buildExpiredStory, buildStory } from '../testing/merchant-story-fixture';
import { toStoryCard } from './story-card-view';

describe('toStoryCard', () => {
  it('writes an active card as the frame does', () => {
    const story = buildStory();

    expect(toStoryCard(story, STORY_NOW)).toEqual({
      story,
      isActive: true,
      isVideo: false,
      statusLabel: 'نشطة',
      remainingText: 'متبقي 14 ساعة',
      publishedText: 'اليوم • 10:30 AM',
      endedText: '2 أكتوبر • 10:30 AM',
      viewsText: '348 مشاهدة',
    });
  });

  it('writes an expired card with both of its dates and no time left', () => {
    const card = toStoryCard(buildExpiredStory({ kind: 'video' }), STORY_NOW);

    expect(card).toEqual(
      expect.objectContaining({
        isActive: false,
        isVideo: true,
        statusLabel: 'منتهية',
        remainingText: null,
        publishedText: '18 سبتمبر • 02:00 PM',
        endedText: '19 سبتمبر • 02:00 PM',
        viewsText: '680 مشاهدة',
      }),
    );
  });
});
