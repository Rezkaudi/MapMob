export interface LiveAdMedia {
  readonly id: number;
  readonly type: string;
  readonly url: string;
  readonly sort_order: number;
}

export interface LiveAd {
  /** Ids come back as numbers on reads and as text right after a create. */
  readonly id: number | string;
  /** "store" for a store's ad. */
  readonly advertiser_type: string;
  readonly store: { readonly id: number | string; readonly name: string } | null;
  readonly title: string;
  readonly description: string | null;
  /** home, map, search or category. */
  readonly placement: string;
  /** ISO moments; `ends_at` is `null` for an ad that never ends. */
  readonly starts_at: string;
  readonly ends_at: string | null;
  readonly priority: number;
  /** active, inactive or expired. */
  readonly status: string;
  /** The pause and resume answers leave out the counts and the media. */
  readonly views_count?: number;
  readonly clicks_count?: number;
  readonly media?: readonly LiveAdMedia[];
  readonly created_at: string;
  readonly updated_at: string;
}
