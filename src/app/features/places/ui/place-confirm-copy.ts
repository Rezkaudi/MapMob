import { ConfirmAction } from '../../../shared/models/confirm-action';
import { ConfirmActionCopy } from '../../../shared/ui/confirm-action-dialog/confirm-action-copy';

export function buildPlaceConfirmCopy(action: ConfirmAction, placeName: string): ConfirmActionCopy {
  if (action === 'activate') {
    return {
      title: 'تفعيل النشاط',
      question: `هل تريد تفعيل ${placeName}؟`,
      detail: 'سيظهر المكان من جديد لمستخدمي التطبيق.',
      confirmLabel: 'تفعيل النشاط',
      tone: 'success',
    };
  }
  if (action === 'suspend') {
    return {
      title: 'إيقاف النشاط',
      question: `هل أنت متأكد من إيقاف ${placeName}؟`,
      detail: 'لن يظهر المكان لمستخدمي التطبيق حتى تتم إعادة تفعيله.',
      confirmLabel: 'إيقاف النشاط',
      tone: 'danger',
    };
  }
  return {
    title: 'حذف المكان',
    question: `هل أنت متأكد من حذف ${placeName}؟`,
    detail: 'سيتم حذف بيانات المكان نهائياً، ولا يمكن التراجع عن ذلك.',
    confirmLabel: 'حذف المكان',
    tone: 'danger',
  };
}
