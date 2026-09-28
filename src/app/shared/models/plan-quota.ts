export type PlanQuotaTone = 'success' | 'error';

/** What a usage card shows about one of the plan's limits. */
export interface PlanQuota {
  readonly usedCount: number;
  readonly limitText: string;
  readonly usedPercent: number;
  readonly isFull: boolean;
  readonly remainingChipText: string;
  readonly remainingChipTone: PlanQuotaTone;
  readonly notice: string;
}
