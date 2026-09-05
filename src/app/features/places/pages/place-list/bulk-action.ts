import { ConfirmTone } from '../../../../shared/ui/confirm-dialog/confirm-dialog';

export type BulkAction = 'activate' | 'suspend' | 'notify' | 'export' | 'delete';

interface BulkActionDialog {
  readonly title: string;
  readonly message: string;
  readonly confirmLabel: string;
  readonly tone: ConfirmTone;
}

/** What the confirm dialog says for each bulk action. */
export const BULK_ACTION_DIALOG: Record<BulkAction, BulkActionDialog> = {
  activate: {
    title: 'تفعيل الشركات',
    message: 'هل أنت متأكد من تفعيل الشركات المحددة؟',
    confirmLabel: 'تفعيل الشركات',
    tone: 'primary',
  },
  suspend: {
    title: 'إيقاف الشركات',
    message: 'هل أنت متأكد من إيقاف الشركات المحددة؟',
    confirmLabel: 'إيقاف الشركات',
    tone: 'primary',
  },
  notify: {
    title: 'إرسال إشعارات',
    message: 'هل أنت متأكد من إرسال إشعار إلى الشركات المحددة؟',
    confirmLabel: 'إرسال الإشعارات',
    tone: 'primary',
  },
  export: {
    title: 'تصدير الشركات',
    message: 'هل أنت متأكد من تصدير الشركات المحددة؟',
    confirmLabel: 'تصدير',
    tone: 'primary',
  },
  delete: {
    title: 'حذف الشركات',
    message: 'هل أنت متأكد من حذف الشركات المحددة؟',
    confirmLabel: 'حذف الشركات',
    tone: 'danger',
  },
};
