const NUMBER_FORMAT = new Intl.NumberFormat('en-US');
/** Syrian pound, the only currency the designs use. */
const CURRENCY = 'ل.س';

export function formatSyrianPounds(amount: number): string {
  return `${NUMBER_FORMAT.format(amount)} ${CURRENCY}`;
}
