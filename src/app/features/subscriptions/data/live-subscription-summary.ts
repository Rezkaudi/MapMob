/** `/admin/subscriptions/summary`; only the counts the strip uses are listed. */
export interface LiveSubscriptionSummary {
  readonly total_count: number;
  readonly active_count: number;
  /** Asked of the server; missing today. */
  readonly ending_soon_count?: number;
}
