import { paginate } from '../../../../mock/paginate';
import { sortListEntries } from '../../../../mock/sort-list-entries';
import { PagedResult } from '../../../core/models/paged-result';
import { PaymentDetail } from '../models/payment-detail';
import { PaymentQuery } from '../models/payment-query';

export function filterPayments(
  payments: readonly PaymentDetail[],
  query: PaymentQuery,
): readonly PaymentDetail[] {
  const matching = payments.filter((payment) => matchesFilters(payment, query));
  return sortListEntries(
    matching,
    query.sort,
    (payment) => payment.paidAt,
    (payment) => payment.companyName,
  );
}

export function queryPayments(
  payments: readonly PaymentDetail[],
  query: PaymentQuery,
): PagedResult<PaymentDetail> {
  return paginate(filterPayments(payments, query), query.pageIndex, query.pageSize);
}

function matchesSearch(payment: PaymentDetail, search: string | undefined): boolean {
  const term = search?.trim();
  return !term || [payment.companyName, payment.transactionNumber].some((field) =>
    field.includes(term),
  );
}

function matchesPaidOn(payment: PaymentDetail, query: PaymentQuery): boolean {
  if (query.paidOn?.from && payment.paidAt < query.paidOn.from) {
    return false;
  }
  return !query.paidOn?.to || payment.paidAt <= query.paidOn.to;
}

function matchesFilters(payment: PaymentDetail, query: PaymentQuery): boolean {
  if (query.paymentMethod && payment.paymentMethod !== query.paymentMethod) {
    return false;
  }
  if (query.currency && payment.currency !== query.currency) {
    return false;
  }
  return matchesSearch(payment, query.search) && matchesPaidOn(payment, query);
}
