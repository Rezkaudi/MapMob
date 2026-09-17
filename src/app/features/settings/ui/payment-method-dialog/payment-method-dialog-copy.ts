import { PaymentMethodDialogState } from '../../models/payment-method-dialog-state';

interface PaymentMethodDialogCopy {
  readonly title: string;
  readonly description: string;
  readonly submitLabel: string;
}

export const PAYMENT_METHOD_DIALOG_COPY: Record<
  PaymentMethodDialogState['mode'],
  PaymentMethodDialogCopy
> = {
  add: {
    title: 'إضافة بوابة دفع',
    description: 'أضف وسيلة دفع جديدة وحدد نوعها وحالتها داخل المنصة.',
    submitLabel: 'إضافة البوابة',
  },
  edit: {
    title: 'تعديل بوابة الدفع',
    description: 'عدّل اسم وسيلة الدفع أو نوعها أو حالتها.',
    submitLabel: 'حفظ التغييرات',
  },
};
