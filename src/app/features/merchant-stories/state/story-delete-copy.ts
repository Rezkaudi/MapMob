import { ConfirmActionCopy } from '../../../shared/ui/confirm-action-dialog/confirm-action-copy';
import { describeStoryDay } from '../../../shared/formatting/story-time-text';
import { formatStoryViews } from '../../../shared/formatting/story-views-text';
import { thumbnailOf } from '../../../shared/state/story-thumbnail';
import { MerchantStory } from '../models/merchant-story';

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
      imageUrl: thumbnailOf(story),
    },
  };
}
