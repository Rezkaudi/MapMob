import {
  STORY_NOW,
  buildExpiredStoryEntry,
  buildHiddenStoryEntry,
  buildStoryEntry,
} from '../testing/story-fixture';
import { buildStoryConfirmCopy } from './story-confirm-copy';

describe('buildStoryConfirmCopy', () => {
  it('asks before hiding, in amber, naming the story and its status', () => {
    expect(buildStoryConfirmCopy('hide', buildStoryEntry(), STORY_NOW)).toEqual({
      title: 'إخفاء القصة',
      question: 'لن تظهر هذه القصة للمستخدمين على MapMob بعد إخفائها.',
      confirmLabel: 'إخفاء القصة',
      tone: 'warning',
      icon: { name: 'eye-hide', size: 24 },
      context: {
        lines: ['صيدلية الشفاء • قصة اليوم', 'حصلت هذه القصة على 842 مشاهدة'],
        imageUrl: 'https://cdn.example.com/story-1.jpg',
        tag: 'الحالة: نشطة',
      },
    });
  });

  it('does not call hiding final: a hidden story can be shown again', () => {
    expect(buildStoryConfirmCopy('hide', buildStoryEntry(), STORY_NOW).detail).toBeUndefined();
  });

  it('asks before showing a hidden story again, in green', () => {
    expect(buildStoryConfirmCopy('show', buildHiddenStoryEntry(), STORY_NOW)).toEqual({
      title: 'إظهار القصة',
      question: 'هل أنت متأكد من إظهار القصة مرة أخرى؟ ستصبح القصة مرئية للمستخدمين مجدداً.',
      confirmLabel: 'إظهار القصة',
      tone: 'success',
      icon: { name: 'eye-clarity', size: 24 },
      context: {
        lines: ['صيدلية الشفاء • قصة اليوم', 'حصلت هذه القصة على 842 مشاهدة'],
        imageUrl: 'https://cdn.example.com/story-1.jpg',
        tag: 'الحالة: مخفية',
      },
    });
  });

  it('warns in red that a delete cannot be undone, with no status tag', () => {
    expect(buildStoryConfirmCopy('delete', buildStoryEntry(), STORY_NOW)).toEqual({
      title: 'حذف القصة',
      question: 'هل أنت متأكد من حذف هذه القصة؟',
      detail: 'تنبيه: إجراء نهائي لا يمكن التراجع عنه',
      detailAppearance: 'callout',
      confirmLabel: 'حذف القصة',
      tone: 'critical',
      context: {
        lines: ['صيدلية الشفاء • قصة اليوم', 'حصلت القصة على 842 مشاهدة'],
        imageUrl: 'https://cdn.example.com/story-1.jpg',
      },
    });
  });

  it('names an older story by its day and shows the still frame of a video', () => {
    const video = buildExpiredStoryEntry({
      kind: 'video',
      posterUrl: 'https://cdn.example.com/poster.jpg',
    });

    const { context } = buildStoryConfirmCopy('delete', video, STORY_NOW);

    expect(context?.lines[0]).toBe('كافيه ورد • قصة 18 سبتمبر');
    expect(context?.imageUrl).toBe('https://cdn.example.com/poster.jpg');
  });
});
