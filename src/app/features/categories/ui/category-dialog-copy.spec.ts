import { buildCategory } from '../testing/category-fixture';
import { buildCategoryConfirmCopy, buildCategoryFormCopy } from './category-dialog-copy';

const RESTAURANTS = buildCategory({ name: 'مطاعم', kind: 'main' });
const SEAFOOD = buildCategory({ name: 'مطاعم بحرية', kind: 'sub', parentId: 'm1' });

describe('buildCategoryFormCopy', () => {
  it('words the add dialog as the design does', () => {
    expect(buildCategoryFormCopy('create')).toEqual({
      title: 'إضافة تصنيف جديد',
      description: 'أضف تصنيفاً رئيسياً أو فرعياً ليظهر ضمن تطبيق MapMob.',
      badgeIcon: 'add-circle',
      parentLabel: 'اختر التصنيف الرئيسي التابع له',
      submitLabel: 'إضافة التصنيف',
    });
  });

  it('words the edit dialog as the design does, with no description', () => {
    expect(buildCategoryFormCopy('edit')).toEqual({
      title: 'تعديل التصنيف',
      description: '',
      badgeIcon: 'edit-outline',
      parentLabel: 'التصنيف الرئيسي التابع له',
      submitLabel: 'حفظ التغييرات',
    });
  });
});

describe('buildCategoryConfirmCopy', () => {
  it('asks to activate a suspended category', () => {
    expect(buildCategoryConfirmCopy('activate', RESTAURANTS)).toEqual({
      title: 'تفعيل التصنيف',
      question: 'هل تريد تفعيل تصنيف مطاعم؟',
      detail: 'سيصبح متاحاً للاستخدام عند إضافة أماكن جديدة.',
      confirmLabel: 'تفعيل التصنيف',
      tone: 'success',
    });
  });

  it('asks to suspend an active category', () => {
    expect(buildCategoryConfirmCopy('suspend', RESTAURANTS)).toEqual({
      title: 'تعطيل التصنيف',
      question: 'هل أنت متأكد من تعطيل تصنيف مطاعم؟',
      detail: 'لن يظهر هذا التصنيف كخيار عند إضافة أماكن جديدة.',
      confirmLabel: 'تعطيل التصنيف',
      tone: 'danger',
    });
  });

  it('warns that deleting a main category takes its sub categories with it', () => {
    expect(buildCategoryConfirmCopy('delete', RESTAURANTS)).toEqual({
      title: 'حذف التصنيف',
      question: 'هل أنت متأكد من حذف تصنيف مطاعم؟',
      detail: 'سيتم حذف جميع التصنيفات الفرعية التابعة له، ولا يمكن التراجع عن ذلك.',
      confirmLabel: 'حذف التصنيف',
      tone: 'danger',
    });
  });

  it('warns that deleting a sub category cannot be undone', () => {
    expect(buildCategoryConfirmCopy('delete', SEAFOOD).detail).toBe(
      'لا يمكن التراجع عن هذا الإجراء.',
    );
  });
});
