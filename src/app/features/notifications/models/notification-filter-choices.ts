import { ChoiceOption } from '../../../shared/ui/choice-chips/choice-option';

/** RTL renders the first chip on the right, as the design leads with "الكل". */
export const AUDIENCE_CHOICES: readonly ChoiceOption[] = [
  { value: null, label: 'الكل' },
  { value: 'users', label: 'المستخدمون' },
  { value: 'companies', label: 'الشركات و المتاجر' },
];

export const KIND_CHOICES: readonly ChoiceOption[] = [
  { value: null, label: 'الكل' },
  { value: 'general', label: 'عام' },
  { value: 'private', label: 'خاص' },
];

/** The filter chips spell "مرسل" without the damma the table pill uses. */
export const STATUS_CHOICES: readonly ChoiceOption[] = [
  { value: null, label: 'الكل' },
  { value: 'sent', label: 'مرسل' },
  { value: 'scheduled', label: 'مجدول' },
  { value: 'draft', label: 'مسودة' },
];
