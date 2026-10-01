import { ConfirmActionCopy } from '../../../shared/ui/confirm-action-dialog/confirm-action-copy';
import { MerchantStory } from '../models/merchant-story';
import { describeStoryDay } from './story-time-text';
import { formatStoryViews } from './story-views-text';

/** A video shows its still frame, when the server has one. */
function pictureOf(story: MerchantStory): string | null {
  return story.kind === 'image' ? story.url : story.posterUrl;
}

export function buildRemoveStoryCopy(
  story: MerchantStory,
  placeName: string,
  now: Date,
): ConfirmActionCopy {
  return {
    title: 'حذف القصة',
    question: 'هل أنت متأكد من حذف هذه القصة؟',
    detail: 'تنبيه: إجراء نهائي لا يمكن التراجع عنه',
    confirmLabel: 'حذف القصة',
    tone: 'critical',
    detailAppearance: 'callout',
    context: {
      lines: [
        `${placeName} • قصة ${describeStoryDay(story.publishedAt, now)}`,
        `حصلت القصة على ${formatStoryViews(story.viewCount)}`,
      ],
      imageUrl: pictureOf(story),
    },
  };
}
