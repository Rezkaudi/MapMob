import { PaymentFilters } from '../models/payment-filters';

/** How many filter groups are set to something other than "الكل". */
export function countActivePaymentFilters(filters: PaymentFilters): number {
  const { from, to } = filters.paidOn;
  return [
    filters.companyName.trim() !== '',
    filters.paymentMethod !== null,
    filters.currency !== null,
    from !== null || to !== null,
  ].filter(Boolean).length;
}
