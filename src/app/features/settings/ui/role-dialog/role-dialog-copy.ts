import { RoleDialogState } from '../../models/role-dialog-state';

export interface RoleDialogCopy {
  readonly title: string;
  readonly description: string;
  readonly submitLabel: string | null;
  readonly statusLabel: string;
}

const EDITABLE_DESCRIPTION = 'تحديد اسم الدور وصلاحيات الوصول لكل قسم في المنصة';
const SAVED_ROLE_STATUS_LABEL = 'الدور مفعّل';

export function roleDialogCopy(dialog: RoleDialogState): RoleDialogCopy {
  switch (dialog.mode) {
    case 'add':
      return {
        title: 'إضافة دور جديد',
        description: EDITABLE_DESCRIPTION,
        submitLabel: 'إضافة الدور',
        statusLabel: 'تفعيل الدور فور الإنشاء',
      };
    case 'edit':
      return {
        title: 'تعديل الدور',
        description: EDITABLE_DESCRIPTION,
        submitLabel: 'حفظ التغييرات',
        statusLabel: SAVED_ROLE_STATUS_LABEL,
      };
    case 'view':
      return {
        title: `صلاحيات ${dialog.role.name}`,
        description: 'هذا الدور يملك كامل الصلاحيات على المنصة ولا يمكن تعديله.',
        submitLabel: null,
        statusLabel: SAVED_ROLE_STATUS_LABEL,
      };
  }
}
