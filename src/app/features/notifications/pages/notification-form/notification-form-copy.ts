import { FormMode } from '../../../../shared/models/form-mode';

export interface NotificationFormCopy {
  readonly title: string;
  readonly description: string;
}

export const NOTIFICATION_FORM_COPY: Record<FormMode, NotificationFormCopy> = {
  create: {
    title: 'إنشاء إشعار جديد',
    description: 'قم بصياغة محتوى الإشعار واختيار الفئة المستهدفة.',
  },
  edit: {
    title: 'تعديل الإشعار',
    description: 'عدّل محتوى الإشعار والفئة المستهدفة وموعد الإرسال.',
  },
};
