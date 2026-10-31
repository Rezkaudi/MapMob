/** One row of GET /owner/overview/interactions; no row has been seen yet, so every field is optional. */
export interface LiveOwnerInteraction {
  readonly id: string | number;
  readonly type?: string | null;
  readonly kind?: string | null;
  readonly title?: string | null;
  readonly message?: string | null;
  readonly body?: string | null;
  readonly createdAt?: string | null;
  readonly created_at?: string | null;
}
