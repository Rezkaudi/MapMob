import { buildConfirmCopy, buildFormCopy } from './region-dialog-copy';

describe('buildFormCopy', () => {
  it('words the add and edit dialogs of a governorate as the design does', () => {
    expect(buildFormCopy('governorate', 'create')).toEqual({
      title: 'إضافة محافظة',
      description: 'إضافة محافظة جديدة للنظام.',
      nameLabel: 'اسم المحافظة',
      submitLabel: 'إضافة المحافظة',
    });
    expect(buildFormCopy('governorate', 'edit')).toEqual({
      title: 'تعديل المحافظة',
      description: 'تعديل بيانات المحافظة وإدارة حالتها',
      nameLabel: 'اسم المحافظة',
      submitLabel: 'حفظ التغييرات',
    });
  });

  it('words the add and edit dialogs of an area', () => {
    expect(buildFormCopy('area', 'create')).toMatchObject({
      title: 'إضافة منطقة',
      description: 'إضافة منطقة جديدة للنظام.',
      nameLabel: 'اسم المنطقة',
      submitLabel: 'إضافة المنطقة',
    });
    expect(buildFormCopy('area', 'edit')).toMatchObject({
      title: 'تعديل المنطقة',
      description: 'تعديل بيانات المنطقة وإدارة حالتها',
    });
  });
});

describe('buildConfirmCopy', () => {
  it('asks to activate a suspended governorate', () => {
    expect(buildConfirmCopy('governorate', 'activate', 'طرطوس')).toEqual({
      title: 'تفعيل المحافظة',
      question: 'هل تريد تفعيل محافظة طرطوس؟',
      detail: 'ستصبح متاحة للاستخدام عند إضافة أماكن جديدة.',
      confirmLabel: 'تفعيل المحافظة',
      tone: 'success',
    });
  });

  it('asks to suspend an active area', () => {
    expect(buildConfirmCopy('area', 'suspend', 'صافيتا')).toEqual({
      title: 'تعطيل المنطقة',
      question: 'هل أنت متأكد من تعطيل منطقة صافيتا؟',
      detail: 'لن تظهر هذه المنطقة كخيار عند إضافة أماكن جديدة.',
      confirmLabel: 'تعطيل المنطقة',
      tone: 'danger',
    });
  });

  it('warns that deleting a governorate takes its areas with it', () => {
    expect(buildConfirmCopy('governorate', 'delete', 'حمص')).toMatchObject({
      title: 'حذف المحافظة',
      question: 'هل أنت متأكد من حذف محافظة حمص؟',
      detail: 'سيتم حذف جميع المناطق التابعة لها، ولا يمكن التراجع عن ذلك.',
      confirmLabel: 'حذف المحافظة',
      tone: 'danger',
    });
  });

  it('warns that deleting an area cannot be undone', () => {
    expect(buildConfirmCopy('area', 'delete', 'صافيتا')).toMatchObject({
      question: 'هل أنت متأكد من حذف منطقة صافيتا؟',
      detail: 'لا يمكن التراجع عن هذا الإجراء.',
    });
  });
});
