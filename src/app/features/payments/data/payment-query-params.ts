import { HttpParams } from '@angular/common/http';
import { LiveFilterValue, toLiveFilterParams } from '../../../core/http/live-filter-params';
import { toLiveSort } from '../../../core/http/live-list-sort';
import { PaymentMethod } from '../../../shared/models/payment-method';
import { PaymentQuery } from '../models/payment-query';

const LIVE_CASH_METHOD = 'cash';

// "Other" is every method but cash; the server matches one method exactly.
const LIVE_METHOD: Record<PaymentMethod, Readonly<Record<string, LiveFilterValue>>> = {
  cash: { payment_method: LIVE_CASH_METHOD },
  other: { payment_method_not: LIVE_CASH_METHOD },
};

/** Every filter the payments list sends. */
export function toPaymentFilterParams(query: PaymentQuery): HttpParams {
  return toLiveFilterParams({
    search: query.search,
    sort_by: toLiveSort(query.sort),
    store_name: query.companyName,
    ...(query.paymentMethod ? LIVE_METHOD[query.paymentMethod] : {}),
    currency: query.currency,
    date_from: query.paidOn?.from,
    date_to: query.paidOn?.to,
  });
}
