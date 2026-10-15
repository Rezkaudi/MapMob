/** A chart line as the live server sends it: one point per period. */
export interface LiveChartSeries {
  readonly key?: string;
  readonly name: string;
  readonly points: readonly { readonly periodStart: string; readonly value: number }[];
}
