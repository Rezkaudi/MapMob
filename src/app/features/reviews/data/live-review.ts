/** A report on a review; the server has sent none yet, so every field is read with care. */
export interface LiveReviewReport {
  readonly status?: string | null;
  readonly reason?: string | null;
  readonly description?: string | null;
  readonly notes?: string | null;
  readonly user?: { readonly name: string | null } | null;
}

export interface LiveReview {
  readonly id: number;
  readonly store_id: number;
  readonly user_id: number;
  readonly rating: number | null;
  readonly comment: string | null;
  readonly status: string;
  readonly created_at: string;
  readonly user: { readonly id: number; readonly name: string | null } | null;
  readonly store: {
    readonly id: number;
    readonly name: { readonly ar?: string; readonly en?: string };
  } | null;
  readonly reports: readonly LiveReviewReport[];
}
