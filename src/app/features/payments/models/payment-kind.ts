import { ChoiceOption } from '../../../shared/ui/choice-chips/choice-option';

/** What the payment buys: a first subscription, a move to a higher plan, or more time. */
export type PaymentKind = 'new' | 'upgrade' | 'renewal';

/** RTL puts the first option on the right, as the design draws the track. */
export const PAYMENT_KIND_CHOICES: readonly ChoiceOption[] = [
  { value: 'new', label: 'اشتراك جديد' },
  { value: 'upgrade', label: 'ترقية باقة' },
  { value: 'renewal', label: 'تجديد اشتراك' },
];
