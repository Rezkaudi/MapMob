import { ConfirmActionCopy } from '../../../../shared/ui/confirm-action-dialog/confirm-action-copy';

export const ROLE_DELETE_COPY: ConfirmActionCopy = {
  title: 'حذف الدور؟',
  question: 'هل أنت متأكد من حذف هذا الدور؟',
  detail: 'لا يمكن التراجع عن هذا الإجراء، ولن يتمكن أي مشرف من استخدام هذا الدور بعد حذفه.',
  confirmLabel: 'حذف الدور',
  tone: 'danger',
};

export const ROLE_SAVED_TITLES = {
  add: 'تمت إضافة الدور',
  edit: 'تم تحديث الدور',
  delete: 'تم حذف الدور',
};

export const ROLE_SAVED_MESSAGE = 'تسري الصلاحيات الجديدة على المشرفين عند تسجيل دخولهم التالي.';
