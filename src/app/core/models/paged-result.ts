export interface PagedResult<T> {
  readonly items: readonly T[];
  readonly totalCount: number;
}
