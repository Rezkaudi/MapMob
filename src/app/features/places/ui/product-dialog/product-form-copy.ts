import { FormMode } from '../../../../shared/models/form-mode';

export interface ProductFormCopy {
  readonly heading: string;
  readonly subtitle: string;
  readonly submitLabel: string;
  readonly submitIcon: string;
}

export const PRODUCT_FORM_COPY: Record<FormMode, ProductFormCopy> = {
  create: {
    heading: 'إضافة منتج أو خدمة',
    subtitle: 'أضف بيانات المنتج أو الخدمة ليظهر ضمن صفحة المكان.',
    submitLabel: 'إضافة منتج او خدمة',
    submitIcon: 'plus',
  },
  edit: {
    heading: 'تعديل منتج أو خدمة',
    subtitle: 'عدّل بيانات المنتج أو الخدمة كما تظهر ضمن صفحة المكان.',
    submitLabel: 'حفظ التعديلات',
    submitIcon: 'check',
  },
};
