import { STORY_NOW, buildExpiredStory, buildStory } from '../testing/merchant-story-fixture';
import { buildRemoveStoryCopy } from './story-delete-copy';

describe('buildRemoveStoryCopy', () => {
  it('writes the delete question of the frame, with the red warning box', () => {
    const copy = buildRemoveStoryCopy(buildStory({ viewCount: 842 }), 'صيدلية الشفاء', STORY_NOW);

    expect(copy).toEqual({
      title: 'حذف القصة',
      question: 'هل أنت متأكد من حذف هذه القصة؟',
      detail: 'تنبيه: إجراء نهائي لا يمكن التراجع عنه',
      confirmLabel: 'حذف القصة',
      tone: 'critical',
      detailAppearance: 'callout',
      context: {
        lines: ['صيدلية الشفاء • قصة اليوم', 'حصلت القصة على 842 مشاهدة'],
        imageUrl: 'https://cdn.example.com/story-1.jpg',
      },
    });
  });

  it('names an older story by its day and shows the poster of a video', () => {
    const video = buildExpiredStory({ kind: 'video', posterUrl: 'https://cdn.example.com/p.jpg' });

    const { context } = buildRemoveStoryCopy(video, 'صيدلية الشفاء', STORY_NOW);

    expect(context?.lines[0]).toBe('صيدلية الشفاء • قصة 18 سبتمبر');
    expect(context?.imageUrl).toBe('https://cdn.example.com/p.jpg');
  });

  it('has no picture for a video the server has no frame of yet', () => {
    const video = buildStory({ kind: 'video', posterUrl: null });

    expect(buildRemoveStoryCopy(video, 'صيدلية الشفاء', STORY_NOW).context?.imageUrl).toBeNull();
  });
});
