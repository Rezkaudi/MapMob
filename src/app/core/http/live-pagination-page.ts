/** The page shape of the newer server routes (ads, payments): the total sits in `pagination`. */
export interface LivePaginationPage<T> {
  readonly data: readonly T[];
  readonly pagination: { readonly total: number };
}
