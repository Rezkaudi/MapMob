import { DateRange } from '../../../shared/models/date-range';
import { PaymentCurrency } from './payment-currency';
import { PaymentMethod } from './payment-method';

/** What the filter panel applies. `null`/empty and an open range mean "الكل". */
export interface PaymentFilters {
  readonly companyName: string;
  readonly paymentMethod: PaymentMethod | null;
  readonly currency: PaymentCurrency | null;
  readonly paidOn: DateRange;
}

export const NO_PAYMENT_FILTERS: PaymentFilters = {
  companyName: '',
  paymentMethod: null,
  currency: null,
  paidOn: { from: null, to: null },
};
