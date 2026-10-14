interface LiveTranslation {
  readonly ar?: string;
  readonly en?: string;
}

export interface LiveCategory {
  readonly id: number;
  readonly parent_id: number | null;
  readonly name: string;
  readonly slug: string;
  readonly is_active: boolean;
  readonly icon: string | null;
  readonly icon_color: string | null;
  readonly translations?: { readonly name?: LiveTranslation | readonly never[] };
  readonly parent: { readonly id: number; readonly name: string } | null;
  readonly stores_count?: number;
  readonly updated_at: string;
}
