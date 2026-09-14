import { ConfirmAction } from '../../../shared/models/confirm-action';
import { FormMode } from '../../../shared/models/form-mode';
import { ConfirmActionCopy } from '../../../shared/ui/confirm-action-dialog/confirm-action-copy';
import { Category } from '../models/category';
import { CategoryFormCopy } from './category-form-copy';

const FORM_COPY: Record<FormMode, CategoryFormCopy> = {
  create: {
    title: 'إضافة تصنيف جديد',
    description: 'أضف تصنيفاً رئيسياً أو فرعياً ليظهر ضمن تطبيق MapMob.',
    badgeIcon: 'add-circle',
    parentLabel: 'اختر التصنيف الرئيسي التابع له',
    submitLabel: 'إضافة التصنيف',
  },
  edit: {
    title: 'تعديل التصنيف',
    description: '',
    badgeIcon: 'edit-outline',
    parentLabel: 'التصنيف الرئيسي التابع له',
    submitLabel: 'حفظ التغييرات',
  },
};

const DELETE_DETAIL_BY_KIND: Record<Category['kind'], string> = {
  main: 'سيتم حذف جميع التصنيفات الفرعية التابعة له، ولا يمكن التراجع عن ذلك.',
  sub: 'لا يمكن التراجع عن هذا الإجراء.',
};

export function buildCategoryFormCopy(mode: FormMode): CategoryFormCopy {
  return FORM_COPY[mode];
}

export function buildCategoryConfirmCopy(
  action: ConfirmAction,
  category: Category,
): ConfirmActionCopy {
  const { name } = category;
  if (action === 'activate') {
    return {
      title: 'تفعيل التصنيف',
      question: `هل تريد تفعيل تصنيف ${name}؟`,
      detail: 'سيصبح متاحاً للاستخدام عند إضافة أماكن جديدة.',
      confirmLabel: 'تفعيل التصنيف',
      tone: 'success',
    };
  }
  if (action === 'suspend') {
    return {
      title: 'تعطيل التصنيف',
      question: `هل أنت متأكد من تعطيل تصنيف ${name}؟`,
      detail: 'لن يظهر هذا التصنيف كخيار عند إضافة أماكن جديدة.',
      confirmLabel: 'تعطيل التصنيف',
      tone: 'danger',
    };
  }
  return {
    title: 'حذف التصنيف',
    question: `هل أنت متأكد من حذف تصنيف ${name}؟`,
    detail: DELETE_DETAIL_BY_KIND[category.kind],
    confirmLabel: 'حذف التصنيف',
    tone: 'danger',
  };
}
