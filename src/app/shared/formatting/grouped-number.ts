const NUMBER_FORMAT = new Intl.NumberFormat('en-US');

/** "24,150": the Latin digits and comma groups the designs draw. */
export function formatGroupedNumber(value: number): string {
  return NUMBER_FORMAT.format(value);
}

/** Reads back what a grouped box shows, so "300,000" is 300000 and junk is 0. */
export function parseGroupedNumber(text: string): number {
  return Number(text.replace(/,/g, '')) || 0;
}
