const NUMBER_FORMAT = new Intl.NumberFormat('en-US');

/** "24,150": the Latin digits and comma groups the designs draw. */
export function formatGroupedNumber(value: number): string {
  return NUMBER_FORMAT.format(value);
}
