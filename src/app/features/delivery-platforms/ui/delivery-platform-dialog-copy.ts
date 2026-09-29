import { ConfirmAction } from '../../../shared/models/confirm-action';
import { FormMode } from '../../../shared/models/form-mode';
import { ConfirmActionCopy } from '../../../shared/ui/confirm-action-dialog/confirm-action-copy';
import { DeliveryPlatformEntry } from '../models/delivery-platform-entry';

export interface DeliveryPlatformFormCopy {
  readonly heading: string;
  readonly subheading: string;
  readonly submitLabel: string;
  readonly submitIcon: string;
}

/** The frame's subtitle was pasted from the product dialog, so it is reworded for platforms. */
export const DELIVERY_PLATFORM_FORM_COPY: Record<FormMode, DeliveryPlatformFormCopy> = {
  create: {
    heading: 'إضافة منصة طلبات جديدة',
    subheading: 'أضف بيانات منصة الطلبات لتظهر ضمن صفحات المتاجر.',
    submitLabel: 'إضافة منصة',
    submitIcon: 'add',
  },
  edit: {
    heading: 'تعديل منصة الطلبات',
    subheading: 'عدّل بيانات منصة الطلبات كما تظهر ضمن صفحات المتاجر.',
    submitLabel: 'حفظ التعديلات',
    submitIcon: 'check',
  },
};

export function buildDeliveryPlatformConfirmCopy(
  action: ConfirmAction,
  platform: DeliveryPlatformEntry,
): ConfirmActionCopy {
  const { name } = platform;
  if (action === 'activate') {
    return {
      title: 'تفعيل المنصة',
      question: `هل تريد تفعيل منصة ${name}؟`,
      detail: 'ستظهر روابطها من جديد في صفحات المتاجر المرتبطة بها.',
      confirmLabel: 'تفعيل المنصة',
      tone: 'success',
    };
  }
  if (action === 'suspend') {
    return {
      title: 'تعطيل المنصة',
      question: `هل أنت متأكد من تعطيل منصة ${name}؟`,
      detail: 'ستختفي روابطها من صفحات المتاجر حتى تعيد تفعيلها.',
      confirmLabel: 'تعطيل المنصة',
      tone: 'danger',
    };
  }
  return {
    title: 'حذف المنصة',
    question: `هل أنت متأكد من حذف منصة ${name}؟`,
    detail: 'سيتم حذف روابط المتاجر بهذه المنصة، ولا يمكن التراجع عن ذلك.',
    confirmLabel: 'حذف المنصة',
    tone: 'danger',
  };
}
