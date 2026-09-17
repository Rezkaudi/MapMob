/** "05/18/2026" from `2026-05-18`: the month-first order the date inputs in the designs show. */
export function formatMonthFirstDate(day: string): string {
  const [year, month, date] = day.split('-');
  return `${month}/${date}/${year}`;
}
