export interface OfferFormCopy {
  readonly title: string;
  readonly description: string;
}

export const OFFER_FORM_COPY: Record<'add' | 'edit', OfferFormCopy> = {
  add: {
    title: 'إضافة عرض جديد',
    description: 'أضف عرضاً جديداً ليظهر للمستخدمين ضمن العروض المتاحة.',
  },
  edit: {
    title: 'تعديل العرض',
    description: 'عدّل تفاصيل العرض، وسيظهر التعديل للمستخدمين بعد الحفظ.',
  },
};
