export interface LiveCity {
  readonly id: number;
  readonly region_id: number;
  readonly name: string;
  readonly is_active: boolean;
  readonly stores_count?: number;
  readonly updated_at: string;
}
