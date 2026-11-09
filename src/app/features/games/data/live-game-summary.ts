export interface LiveGameSummary {
  readonly total: number;
  readonly draft: number;
  readonly scheduled: number;
  readonly active: number;
  readonly completed: number;
  /** Asked of the server; missing today. */
  readonly winnerCount?: number;
  /** Asked of the server; missing today. */
  readonly deliveredPrizeCount?: number;
}
