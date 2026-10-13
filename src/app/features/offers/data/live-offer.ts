export interface LiveOffer {
  /** Ids come back as numbers on reads and as text right after a create. */
  readonly id: number | string;
  readonly store_id: number | string;
  readonly store_name: string;
  readonly product_id: number | string | null;
  readonly scope: {
    readonly type: string;
    readonly product_id: number | string | null;
    readonly product_name: string | null;
  };
  readonly title: string;
  readonly description: string | null;
  readonly image: string | null;
  /** A decimal written as text, like "20.00". */
  readonly discount_percentage: string;
  readonly starts_at: string;
  readonly ends_at: string;
  readonly status: string;
}
