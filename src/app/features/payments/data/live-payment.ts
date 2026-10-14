export interface LivePayment {
  readonly id: number;
  readonly store: { readonly id: number; readonly name: string };
  readonly subscription_id: number | null;
  readonly amount: string;
  readonly currency_code: string;
  readonly paid_at: string | null;
  readonly payment_method: string;
  readonly receipt_number: string | null;
  readonly notes: string | null;
  readonly status: string;
  readonly created_at: string;
}
