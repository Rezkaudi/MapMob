/** The fields of `GET /admin/users/{id}` the reviewer card shows. */
export interface LiveReviewer {
  readonly name: string | null;
  readonly email_verified_at: string | null;
  readonly created_at: string;
}

/** The fields of `GET /admin/stores/{id}` the reviewed place card shows. */
export interface LiveReviewedStore {
  readonly mainCategory: { readonly name: string } | null;
  readonly location: {
    readonly governorate: { readonly name: string } | null;
    readonly area: { readonly name: string } | null;
  } | null;
}
