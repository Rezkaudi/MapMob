/** `total_amount` is a decimal string and mixes every currency today. */
export interface LivePaymentSummary {
  readonly total_amount: string;
  readonly total_count: number;
  readonly paid_count: number;
  readonly pending_count: number;
}
