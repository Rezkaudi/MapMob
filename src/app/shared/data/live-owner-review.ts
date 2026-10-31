/** A review row of the /owner routes; no row has been seen yet, so the author can come in several shapes. */
export interface LiveOwnerReview {
  readonly id: string | number;
  readonly rating: number | null;
  readonly comment?: string | null;
  readonly authorName?: string | null;
  readonly userName?: string | null;
  readonly user?: { readonly id?: string | number; readonly name: string } | null;
  readonly author?: { readonly id?: string | number; readonly name: string } | null;
  readonly createdAt?: string | null;
  readonly created_at?: string | null;
  readonly reportStatus?: string | null;
  readonly report?: { readonly status?: string | null } | null;
}
