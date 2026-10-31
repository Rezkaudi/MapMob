export interface LiveOwnerPerformancePoint {
  /** `yyyy` (yearly), `yyyy-mm` (monthly) or `yyyy-ww`, an ISO week number (weekly). */
  readonly periodStart: string;
  readonly views: number;
}

/** GET /owner/overview/performance */
export interface LiveOwnerPerformance {
  readonly points: readonly LiveOwnerPerformancePoint[];
  readonly averageViews: number;
  readonly topDay: LiveOwnerPerformancePoint | null;
}
