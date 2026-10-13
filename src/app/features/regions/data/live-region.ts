export interface LiveRegion {
  readonly id: number;
  readonly name: { readonly ar: string; readonly en: string };
  readonly is_active: boolean;
  readonly cities_count?: number;
  readonly stores_count?: number;
  readonly updated_at: string;
}
