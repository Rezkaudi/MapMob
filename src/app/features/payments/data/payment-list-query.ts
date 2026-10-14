import { paginate } from '../../../shared/lists/paginate';
import { sortListEntries } from '../../../shared/lists/sort-list-entries';
import { PagedResult } from '../../../core/models/paged-result';
import { Payment } from '../models/payment';
import { PaymentQuery } from '../models/payment-query';

export function filterPayments<T extends Payment>(
  payments: readonly T[],
  query: PaymentQuery,
): readonly T[] {
  const matching = payments.filter((payment) => matchesFilters(payment, query));
  return sortListEntries(
    matching,
    query.sort,
    (payment) => payment.paidAt,
    (payment) => payment.companyName,
  );
}

export function queryPayments<T extends Payment>(
  payments: readonly T[],
  query: PaymentQuery,
): PagedResult<T> {
  return paginate(filterPayments(payments, query), query.pageIndex, query.pageSize);
}

function matchesSearch(payment: Payment, search: string | undefined): boolean {
  const term = search?.trim();
  return (
    !term || [payment.companyName, payment.transactionNumber].some((field) => field.includes(term))
  );
}

function matchesPaidOn(payment: Payment, query: PaymentQuery): boolean {
  if (query.paidOn?.from && payment.paidAt < query.paidOn.from) {
    return false;
  }
  return !query.paidOn?.to || payment.paidAt <= query.paidOn.to;
}

function matchesFilters(payment: Payment, query: PaymentQuery): boolean {
  if (query.paymentMethod && payment.paymentMethod !== query.paymentMethod) {
    return false;
  }
  if (query.currency && payment.currency !== query.currency) {
    return false;
  }
  return matchesSearch(payment, query.search) && matchesPaidOn(payment, query);
}
