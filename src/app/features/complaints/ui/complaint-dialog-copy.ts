import { ConfirmActionCopy } from '../../../shared/ui/confirm-action-dialog/confirm-action-copy';
import { Complaint } from '../models/complaint';

export function buildComplaintDeleteCopy(complaint: Complaint): ConfirmActionCopy {
  return {
    title: 'حذف البلاغ',
    question: `هل أنت متأكد من حذف البلاغ ${complaint.reference}؟`,
    detail: 'سيتم حذف البلاغ نهائياً من المنصة، ولا يمكن التراجع عن ذلك.',
    confirmLabel: 'حذف البلاغ',
    tone: 'danger',
  };
}
