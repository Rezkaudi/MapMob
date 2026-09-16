/** "07/09/2026" — Latin digits, day before month, the shape the payment detail modal uses. */
export function formatSlashDate(day: string): string {
  const [year, month, date] = day.split('-');
  return `${date}/${month}/${year}`;
}
