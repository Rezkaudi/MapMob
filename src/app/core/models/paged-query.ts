export interface PagedQuery {
  readonly pageIndex: number;
  readonly pageSize: number;
  readonly search?: string;
}
