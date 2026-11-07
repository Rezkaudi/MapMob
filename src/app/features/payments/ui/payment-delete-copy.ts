import { ConfirmActionCopy } from '../../../shared/ui/confirm-action-dialog/confirm-action-copy';
import { Payment } from '../models/payment';

const LEFT_TO_RIGHT_ISOLATE = '⁦';
const POP_DIRECTIONAL_ISOLATE = '⁩';

/** The "#PAY-4" number is Latin, so it is isolated or the RTL line moves its "#" to the end. */
export function buildPaymentDeleteCopy(payment: Payment): ConfirmActionCopy {
  const number = `${LEFT_TO_RIGHT_ISOLATE}${payment.transactionNumber}${POP_DIRECTIONAL_ISOLATE}`;
  return {
    title: 'حذف الدفعة',
    question: `هل أنت متأكد من حذف الدفعة ${number} الخاصة بـ "${payment.companyName}"؟`,
    detail: 'سيتم حذف الدفعة نهائياً من سجل المدفوعات وتحديث الإجماليات، ولا يمكن التراجع عن ذلك.',
    confirmLabel: 'حذف الدفعة',
    tone: 'danger',
  };
}
