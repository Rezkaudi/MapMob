import { ConfirmActionCopy } from '../../../shared/ui/confirm-action-dialog/confirm-action-copy';
import { Ad } from '../models/ad';

export function buildAdDeleteCopy(ad: Ad): ConfirmActionCopy {
  return {
    title: 'حذف الإعلان',
    question: `هل أنت متأكد من حذف إعلان "${ad.title}"؟`,
    detail: 'سيتوقف ظهور الإعلان في التطبيق ويُحذف نهائياً، ولا يمكن التراجع عن ذلك.',
    confirmLabel: 'حذف الإعلان',
    tone: 'danger',
  };
}
