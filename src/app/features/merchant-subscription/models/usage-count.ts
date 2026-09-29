export interface UsageCount {
  readonly used: number;
  /** null = no cap. */
  readonly limit: number | null;
}
