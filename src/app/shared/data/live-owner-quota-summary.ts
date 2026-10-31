/** The plan and quota part of every GET /owner/<things>/summary. */
export interface LiveOwnerQuotaSummary {
  readonly plan: { readonly id: string; readonly name: string } | null;
  readonly quota: { readonly limit: number };
}
