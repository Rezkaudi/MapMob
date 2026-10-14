export interface LivePlan {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly price: number;
  readonly currency_code: string;
  readonly duration_days: number;
  readonly max_ads: number | null;
  readonly max_offers: number | null;
  readonly max_products: number | null;
  readonly max_images: number | null;
  readonly features: readonly string[] | null;
  readonly is_active: boolean;
  readonly sort_order: number;
  readonly created_at: string;
}
