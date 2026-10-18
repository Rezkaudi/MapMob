export interface IconTab<TValue extends string = string> {
  readonly value: TValue;
  readonly label: string;
  /** Matches a file in `public/assets/icons`. */
  readonly icon: string;
  readonly iconSize: number;
}
