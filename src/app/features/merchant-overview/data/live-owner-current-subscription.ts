/** `current` of GET /owner/overview/subscription; null when the place has no plan. */
export interface LiveOwnerCurrentSubscription {
  readonly plan: {
    readonly id: string;
    readonly name: string;
    readonly features: readonly string[];
  };
  readonly startsAt: string;
  readonly endsAt: string;
}
