import { ConfirmTone } from '../../../../shared/ui/confirm-dialog/confirm-dialog';

export type BulkAction = 'activate' | 'suspend' | 'export' | 'delete';

interface BulkActionDialog {
  readonly title: string;
  readonly message: string;
  readonly confirmLabel: string;
  readonly tone: ConfirmTone;
  readonly warning?: string;
}

/** What the confirm dialog says for each bulk action. */
export const BULK_ACTION_DIALOG: Record<BulkAction, BulkActionDialog> = {
  activate: {
    title: 'تفعيل الشركات',
    message: 'هل أنت متأكد من تفعيل الشركات المحددة؟',
    confirmLabel: 'تفعيل الشركات',
    tone: 'success',
  },
  suspend: {
    title: 'إيقاف الشركات',
    message: 'هل أنت متأكد من إيقاف الشركات المحددة؟',
    confirmLabel: 'إيقاف الشركات',
    tone: 'warning',
  },
  export: {
    title: 'تصدير الشركات',
    message: 'هل أنت متأكد من تصدير الشركات المحددة؟',
    confirmLabel: 'تصدير',
    tone: 'success',
  },
  delete: {
    title: 'حذف الشركات',
    message: 'هل أنت متأكد من رغبتك في حذف الشركات المحددة نهائياً؟',
    confirmLabel: 'حذف الشركات',
    tone: 'danger',
    warning: 'تنبيه: إجراء نهائي لا يمكن التراجع عنه',
  },
};
