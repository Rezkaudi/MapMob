export interface ChipOption {
  readonly value: string;
  readonly label: string;
  readonly count: number;
  /** Tailwind background class for the leading dot. Left out on the "all" chip. */
  readonly dotClass?: string;
}
