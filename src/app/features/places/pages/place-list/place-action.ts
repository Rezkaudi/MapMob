import { ConfirmTone } from '../../../../shared/ui/confirm-dialog/confirm-dialog';

export type PlaceAction = 'activate' | 'suspend' | 'export' | 'delete';

interface PlaceActionDialog {
  readonly title: string;
  readonly message: string;
  readonly confirmLabel: string;
  readonly tone: ConfirmTone;
  readonly warning?: string;
}

/** What the confirm dialog says for each action, whether one row asked or the bulk bar did. */
export const PLACE_ACTION_DIALOG: Record<PlaceAction, PlaceActionDialog> = {
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
