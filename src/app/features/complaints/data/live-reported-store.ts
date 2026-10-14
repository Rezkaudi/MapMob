/** The few fields of `GET /admin/stores/{id}` the reported place card shows. */
export interface LiveReportedStore {
  readonly id: string;
  readonly logoUrl: string | null;
  readonly mainCategory: { readonly name: string } | null;
  readonly rating: number;
  readonly reviewCount: number;
  readonly location: { readonly address: string | null } | null;
}
