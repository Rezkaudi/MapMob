import { ConfirmActionCopy } from '../../../shared/ui/confirm-action-dialog/confirm-action-copy';
import { Ad } from '../models/ad';
import { AdConfirmAction } from '../models/ad-confirm-action';

export function buildAdConfirmCopy(action: AdConfirmAction, ad: Ad): ConfirmActionCopy {
  if (action === 'pause') {
    return {
      title: 'إيقاف الإعلان',
      question: `هل تريد إيقاف إعلان "${ad.title}"؟`,
      detail: 'سيختفي الإعلان من التطبيق حتى تتم إعادة تفعيله.',
      confirmLabel: 'إيقاف الإعلان',
      tone: 'danger',
    };
  }
  if (action === 'resume') {
    return {
      title: 'تفعيل الإعلان',
      question: `هل تريد تفعيل إعلان "${ad.title}"؟`,
      detail: 'سيعود الإعلان للظهور في التطبيق حسب تواريخ عرضه.',
      confirmLabel: 'تفعيل الإعلان',
      tone: 'success',
    };
  }
  return {
    title: 'حذف الإعلان',
    question: `هل أنت متأكد من حذف إعلان "${ad.title}"؟`,
    detail: 'سيتوقف ظهور الإعلان في التطبيق ويُحذف نهائياً، ولا يمكن التراجع عن ذلك.',
    confirmLabel: 'حذف الإعلان',
    tone: 'danger',
  };
}
