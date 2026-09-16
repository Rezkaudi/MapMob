export interface AdFormCopy {
  readonly title: string;
  readonly description: string;
}

export const AD_FORM_COPY: Record<'add' | 'edit', AdFormCopy> = {
  add: { title: 'إضافة إعلان جديد', description: 'أضف إعلاناً جديداً وحدد كامل التفاصيل.' },
  edit: { title: 'تعديل الإعلان', description: 'عدّل تفاصيل الإعلان، وسيظهر التعديل بعد الحفظ.' },
};
