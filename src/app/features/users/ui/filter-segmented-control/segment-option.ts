export type SegmentTone = 'primary' | 'success' | 'danger';

export interface SegmentOption {
  /** `null` stands for "الكل". */
  readonly value: string | null;
  readonly label: string;
  readonly tone: SegmentTone;
}
