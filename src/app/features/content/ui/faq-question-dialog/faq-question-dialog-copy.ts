import { FaqDialog } from '../../models/faq-dialog';

export interface FaqQuestionDialogCopy {
  readonly title: string;
  readonly subtitle: string;
  readonly submitLabel: string;
}

export const FAQ_QUESTION_DIALOG_COPY: Record<FaqDialog['mode'], FaqQuestionDialogCopy> = {
  add: {
    title: 'إضافة سؤال جديد',
    subtitle: 'سيظهر هذا السؤال مباشرة في قائمة الأسئلة الشائعة.',
    submitLabel: 'إضافة السؤال',
  },
  edit: {
    title: 'تعديل السؤال',
    subtitle: 'تعديل نص السؤال أو الإجابة الحالية.',
    submitLabel: 'حفظ التغييرات',
  },
};
