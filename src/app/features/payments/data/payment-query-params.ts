import { HttpParams } from '@angular/common/http';
import { toLiveFilterParams } from '../../../core/http/live-filter-params';
import { toLiveSort } from '../../../core/http/live-list-sort';
import { PaymentQuery } from '../models/payment-query';

/** Every filter the payments list sends. */
export function toPaymentFilterParams(query: PaymentQuery): HttpParams {
  return toLiveFilterParams({
    search: query.search,
    sort_by: toLiveSort(query.sort),
    store_name: query.companyName,
    // The server matches one word exactly, and the panel saves every non-cash payment as "other".
    payment_method: query.paymentMethod,
    currency: query.currency,
    date_from: query.paidOn?.from,
    date_to: query.paidOn?.to,
  });
}
