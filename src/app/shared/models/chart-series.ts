export interface ChartSeriesPoint {
  readonly label: string;
  readonly value: number;
}

export interface ChartSeries {
  readonly name: string;
  readonly points: readonly ChartSeriesPoint[];
}
