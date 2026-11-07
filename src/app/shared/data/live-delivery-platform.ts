/** An ordering app as the live server sends it. `name` always comes back in English. */
export interface LiveDeliveryPlatform {
  readonly id: number | string;
  readonly name: string;
  readonly logo: string | null;
  readonly is_active: boolean;
  readonly sort_order: number | null;
  /** Not kept by the server yet; the panel sends it so it is saved once the backend adds it. */
  readonly website_url?: string | null;
  readonly created_at: string;
}
