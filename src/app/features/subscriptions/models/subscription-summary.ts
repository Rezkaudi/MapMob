/** The four counts the strip above the tabs reports. */
export interface SubscriptionSummary {
  readonly topPlanName: string;
  readonly topPlanSubscriberCount: number;
  readonly availablePlanCount: number;
  /** Subscriptions whose term ends within the next week. */
  readonly endingSoonCount: number;
  readonly activeSubscriberCount: number;
  /** Active subscribers as a share of every subscriber, between 0 and 1. */
  readonly activeSubscriberShare: number;
}
