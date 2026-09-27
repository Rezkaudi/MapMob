/** What the "إحصائيات الأداء والتفاعل" card counts. The click rate is derived, never stored. */
export interface AdMetrics {
  readonly impressions: number;
  readonly clicks: number;
  readonly uniqueUsers: number;
}
