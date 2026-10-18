export interface GameFormCopy {
  readonly title: string;
  readonly description: string;
  readonly saveLabel: string;
}

export const GAME_FORM_COPY: Record<'add' | 'edit', GameFormCopy> = {
  add: { title: 'إنشاء لعبة جديدة', description: 'حدد إعدادات اللعبة', saveLabel: 'إنشاء اللعبة' },
  edit: {
    title: 'تعديل اللعبة',
    description: 'عدّل إعدادات اللعبة قبل موعد انطلاقها',
    saveLabel: 'حفظ التعديلات',
  },
};
