import { ConfirmActionCopy } from '../../../shared/ui/confirm-action-dialog/confirm-action-copy';
import { Review } from '../models/review';

export function buildReviewDeleteCopy(review: Review): ConfirmActionCopy {
  return {
    title: 'حذف التقييم',
    question: `هل أنت متأكد من حذف تقييم ${review.userName}؟`,
    detail: 'سيتم حذف التقييم نهائياً من المنصة، ولا يمكن التراجع عن ذلك.',
    confirmLabel: 'حذف التقييم',
    tone: 'danger',
  };
}
