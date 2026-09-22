/** One package the dialog can charge for, priced per term. */
export interface PaymentPlan {
  readonly id: string;
  readonly name: string;
  readonly monthlyPrice: number;
  /** `null` when the plan has no yearly price of its own. */
  readonly yearlyPrice: number | null;
}
