/** GET /owner/overview/summary */
export interface LiveOwnerSummary {
  readonly place: { readonly id: string; readonly name: string };
  readonly views: { readonly value: number };
  readonly searchAppearances: number | null;
  readonly favorites: number;
  readonly rating: { readonly average: number; readonly reviewCount: number };
}
