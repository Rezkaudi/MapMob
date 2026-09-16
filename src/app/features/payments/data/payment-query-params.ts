import { HttpParams } from '@angular/common/http';
import { PaymentQuery } from '../models/payment-query';

const OPTIONAL_FILTER_KEYS = ['search', 'sort', 'paymentMethod', 'currency'] as const;

export function toPaymentQueryParams(query: PaymentQuery): HttpParams {
  let params = new HttpParams().set('pageIndex', query.pageIndex).set('pageSize', query.pageSize);
  for (const key of OPTIONAL_FILTER_KEYS) {
    const value = query[key];
    if (value) {
      params = params.set(key, value);
    }
  }
  if (query.paidOn?.from) {
    params = params.set('paidFrom', query.paidOn.from);
  }
  if (query.paidOn?.to) {
    params = params.set('paidTo', query.paidOn.to);
  }
  return params;
}
