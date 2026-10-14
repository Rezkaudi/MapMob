/** The few fields of `GET /admin/stores/{id}` the company card shows. */
export interface LivePaymentStore {
  readonly mainCategory: { readonly name: string } | null;
  readonly owner: { readonly name: string | null } | null;
  readonly contact: { readonly phone: string | null } | null;
}
