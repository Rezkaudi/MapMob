import { ConfirmActionCopy } from './confirm-action-copy';

/** The admin and the place owner are asked the same thing before an offer goes. */
export function buildOfferDeleteCopy(offerTitle: string): ConfirmActionCopy {
  return {
    title: 'حذف العرض',
    question: `هل أنت متأكد من حذف عرض "${offerTitle}"؟`,
    detail: 'سيتم حذف العرض نهائياً ولن يظهر للمستخدمين، ولا يمكن التراجع عن ذلك.',
    confirmLabel: 'حذف العرض',
    tone: 'danger',
  };
}
