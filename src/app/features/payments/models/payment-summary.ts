export interface PaymentSummary {
  readonly pendingCount: number;
  readonly transactionCount: number;
  readonly monthTotal: number;
  readonly cumulativeTotal: number;
}
