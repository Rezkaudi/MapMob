import { buildReview } from '../testing/review-fixture';
import { buildReviewDeleteCopy } from './review-dialog-copy';

describe('buildReviewDeleteCopy', () => {
  it('names the reviewer and warns that the delete is final', () => {
    expect(buildReviewDeleteCopy(buildReview({ userName: 'سارة محمد' }))).toEqual({
      title: 'حذف التقييم',
      question: 'هل أنت متأكد من حذف تقييم سارة محمد؟',
      detail: 'سيتم حذف التقييم نهائياً من المنصة، ولا يمكن التراجع عن ذلك.',
      confirmLabel: 'حذف التقييم',
      tone: 'danger',
    });
  });
});
