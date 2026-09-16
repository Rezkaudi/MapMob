import { ChoiceOption } from '../../../shared/ui/choice-chips/choice-option';
import { PAYMENT_METHOD_LABELS } from './payment-method';

/** RTL renders the first option on the right, so this reads "آخرى، نقداً، الكل" left to right. */
export const PAYMENT_METHOD_CHOICES: readonly ChoiceOption[] = [
  { value: null, label: 'الكل' },
  { value: 'cash', label: PAYMENT_METHOD_LABELS.cash },
  { value: 'other', label: PAYMENT_METHOD_LABELS.other },
];
