import { BillingCycle } from '../../../shared/models/billing-cycle';
import { CurrencyCode } from '../../../shared/money/currency-code';
import { formatMoney } from '../../../shared/money/format-money';
import { TERM_ADVERB } from './term-words';

/** "150,000 ل.س / شهرياً" */
export function formatPricePerTerm(
  amount: number,
  currency: CurrencyCode,
  term: BillingCycle,
): string {
  return `${formatMoney(amount, currency)} / ${TERM_ADVERB[term]}`;
}
