export interface CampaignSummary {
  readonly totalCount: number;
  readonly activeCount: number;
  readonly scheduledCount: number;
  /** Expired and paused campaigns, counted together as the designs' fourth card does. */
  readonly endedCount: number;
}
