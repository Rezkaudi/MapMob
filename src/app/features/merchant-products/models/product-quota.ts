export type ProductQuotaTone = 'success' | 'error';

/** What the usage card shows about the plan's product limit. */
export interface ProductQuota {
  readonly usedCount: number;
  readonly limitText: string;
  readonly usedPercent: number;
  readonly isFull: boolean;
  readonly remainingChipText: string;
  readonly remainingChipTone: ProductQuotaTone;
  readonly notice: string;
}
