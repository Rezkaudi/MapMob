/** A row of GET /owner/stories. */
export interface LiveOwnerStory {
  readonly id: string;
  readonly type: string;
  readonly caption: string | null;
  readonly url: string;
  /** active, expired or hidden (an admin hid it). */
  readonly status: string;
  readonly expiresAt: string;
  readonly createdAt: string;
}
