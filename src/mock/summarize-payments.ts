import { PaymentSummary } from '../app/features/payments/models/payment-summary';

const YEAR_MONTH_LENGTH = 7;

interface PaymentEntry {
  readonly amount: number;
  readonly currency: 'USD' | 'SYP';
  readonly paymentMethod: 'cash' | 'other';
  readonly paidAt: string;
}

function yearMonthOf(day: string): string {
  return day.slice(0, YEAR_MONTH_LENGTH);
}

function sumUsd(entries: readonly PaymentEntry[]): number {
  return entries
    .filter((entry) => entry.currency === 'USD')
    .reduce((total, entry) => total + entry.amount, 0);
}

/**
 * A payment recorded manually from a bank transfer ("other") stays "قيد المتابعة"
 * until the platform confirms the transfer landed; cash is confirmed on the spot.
 */
export function summarizePayments(
  entries: readonly PaymentEntry[],
  today: string,
): PaymentSummary {
  const currentMonth = yearMonthOf(today);
  return {
    transactionCount: entries.length,
    pendingCount: entries.filter((entry) => entry.paymentMethod === 'other').length,
    monthTotal: sumUsd(entries.filter((entry) => yearMonthOf(entry.paidAt) === currentMonth)),
    cumulativeTotal: sumUsd(entries),
  };
}
