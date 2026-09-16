import { DateRange } from '../../../shared/models/date-range';
import { ListQuery } from '../../../shared/models/list-query';
import { PaymentCurrency } from './payment-currency';
import { PaymentMethod } from './payment-method';

export interface PaymentQuery extends ListQuery {
  readonly companyName?: string;
  readonly paymentMethod?: PaymentMethod | null;
  readonly currency?: PaymentCurrency | null;
  readonly paidOn?: DateRange;
}
