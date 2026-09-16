import { PaymentSummary } from '../models/payment-summary';

const ICON = 'payments';

export interface PaymentStatCard {
  readonly label: string;
  readonly value: string;
  readonly icon: string;
}

/** RTL puts the first card on the right; the design leads with the running total there. */
export function buildPaymentStatCards(summary: PaymentSummary | null): readonly PaymentStatCard[] {
  return [
    {
      label: 'إجمالي المدفعوعات التراكمية',
      value: `$${summary?.cumulativeTotal ?? 0}`,
      icon: ICON,
    },
    { label: 'مدفوعات هذا الشهر', value: `${summary?.monthTotal ?? 0}$`, icon: ICON },
    { label: 'عدد عمليات الدفع', value: `${summary?.transactionCount ?? 0}`, icon: ICON },
    { label: 'المدفوعات قيد المتابعة', value: `${summary?.pendingCount ?? 0}`, icon: ICON },
  ];
}
