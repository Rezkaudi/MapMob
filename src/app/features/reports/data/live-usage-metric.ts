/** One row of `/admin/reports/usage`. */
export interface LiveUsageMetric {
  readonly key: string;
  readonly label: string;
  readonly count: number;
  readonly sharePercent: number;
}
