import { ChoiceOption } from '../../../shared/ui/choice-chips/choice-option';
import { PAYMENT_CURRENCY_LABELS } from './payment-currency';

/** RTL renders the first option on the right, so this reads "ليرة سورية، دولار، الكل" left to right. */
export const PAYMENT_CURRENCY_CHOICES: readonly ChoiceOption[] = [
  { value: null, label: 'الكل' },
  { value: 'USD', label: PAYMENT_CURRENCY_LABELS.USD },
  { value: 'SYP', label: PAYMENT_CURRENCY_LABELS.SYP },
];
