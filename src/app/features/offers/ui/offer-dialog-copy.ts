import { ConfirmActionCopy } from '../../../shared/ui/confirm-action-dialog/confirm-action-copy';
import { Offer } from '../models/offer';

export function buildOfferDeleteCopy(offer: Offer): ConfirmActionCopy {
  return {
    title: 'حذف العرض',
    question: `هل أنت متأكد من حذف عرض "${offer.title}"؟`,
    detail: 'سيتم حذف العرض نهائياً ولن يظهر للمستخدمين، ولا يمكن التراجع عن ذلك.',
    confirmLabel: 'حذف العرض',
    tone: 'danger',
  };
}
