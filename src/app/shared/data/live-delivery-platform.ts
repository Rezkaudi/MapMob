/** An ordering app as the live server sends it. `name` always comes back in English. */
export interface LiveDeliveryPlatform {
  readonly id: number | string;
  readonly name: string;
  readonly logo: string | null;
  readonly is_active: boolean;
  readonly sort_order: number | null;
  readonly created_at: string;
}
