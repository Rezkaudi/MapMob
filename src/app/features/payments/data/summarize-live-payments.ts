import { PaymentSummary } from '../models/payment-summary';
import { LivePayment } from './live-payment';
import { toPayment } from './live-payment-mapping';

const YEAR_MONTH_LENGTH = 7;
const PENDING_STATUS = 'pending';
const PAID_STATUS = 'paid';
// The cards show dollars, as the design does; the server's own total mixes currencies.
const SUMMARY_CURRENCY = 'USD';

function sumAmounts(rows: readonly LivePayment[]): number {
  return rows.reduce((total, row) => total + Number(row.amount), 0);
}

export function summarizeLivePayments(rows: readonly LivePayment[], today: string): PaymentSummary {
  const currentMonth = today.slice(0, YEAR_MONTH_LENGTH);
  const paidDollars = rows.filter(
    (row) => row.status === PAID_STATUS && row.currency_code === SUMMARY_CURRENCY,
  );
  return {
    transactionCount: rows.length,
    pendingCount: rows.filter((row) => row.status === PENDING_STATUS).length,
    monthTotal: sumAmounts(
      paidDollars.filter(
        (row) => toPayment(row).paidAt.slice(0, YEAR_MONTH_LENGTH) === currentMonth,
      ),
    ),
    cumulativeTotal: sumAmounts(paidDollars),
  };
}
