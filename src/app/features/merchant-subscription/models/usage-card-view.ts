/** One "استخدام الباقة" card, ready to draw. */
export interface UsageCardView {
  readonly title: string;
  readonly iconName: string;
  readonly usedCount: number;
  readonly limitText: string;
  /** 0–100, the width of the filled bar. */
  readonly usedPercent: number;
  /** Empty when the plan does not cap this kind. */
  readonly percentText: string;
  readonly isNearLimit: boolean;
  readonly note: string;
}
