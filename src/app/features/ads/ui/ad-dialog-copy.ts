import { ConfirmActionCopy } from '../../../shared/ui/confirm-action-dialog/confirm-action-copy';
import { Ad } from '../models/ad';
import { AdConfirmAction } from '../models/ad-confirm-action';

/**
 * The frame writes "تم تحديد 5 شركات" here, copy left over from a bulk dialog.
 * One ad is being changed, so the line names that ad instead.
 */
function selectionLine(ad: Ad): string {
  return `تم تحديد إعلان "${ad.title}"`;
}

export function buildAdConfirmCopy(action: AdConfirmAction, ad: Ad): ConfirmActionCopy {
  if (action === 'pause') {
    return {
      title: 'إيقاف الإعلان',
      question: 'هل أنت متأكد من رغبتك في إيقاف هذا الإعلان؟',
      detail: selectionLine(ad),
      confirmLabel: 'إيقاف الإعلان',
      tone: 'warning',
      detailAppearance: 'toned',
    };
  }
  if (action === 'resume') {
    return {
      title: 'تفعيل الإعلان',
      question: 'هل أنت متأكد من رغبتك في تفعيل هذا الإعلان؟',
      detail: selectionLine(ad),
      confirmLabel: 'تفعيل الإعلان',
      tone: 'success',
      detailAppearance: 'toned',
    };
  }
  return {
    title: 'حذف الإعلان',
    question: 'هل أنت متأكد من رغبتك في حذف هذا الإعلان نهائياً؟',
    detail: 'تنبيه: إجراء نهائي لا يمكن التراجع عنه',
    confirmLabel: 'حذف الإعلان',
    tone: 'critical',
    detailAppearance: 'callout',
  };
}
