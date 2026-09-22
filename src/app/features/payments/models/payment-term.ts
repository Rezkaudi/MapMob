import { ChoiceOption } from '../../../shared/ui/choice-chips/choice-option';

/** How long the subscription the payment pays for runs. */
export type PaymentTerm = 'monthly' | 'yearly';

/** RTL puts the first option on the right, as the design draws the track. */
export const PAYMENT_TERM_CHOICES: readonly ChoiceOption[] = [
  { value: 'monthly', label: 'شهري' },
  { value: 'yearly', label: 'سنوي (خصم 20%)' },
];
