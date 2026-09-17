const PADDED_LENGTH = 2;

function pad(value: number): string {
  return String(value).padStart(PADDED_LENGTH, '0');
}

/** A local moment as the `yyyy-mm-ddThh:mm` wall-clock text notifications are sent at. */
export function toWallClockTime(moment: Date): string {
  const day = `${moment.getFullYear()}-${pad(moment.getMonth() + 1)}-${pad(moment.getDate())}`;
  return `${day}T${pad(moment.getHours())}:${pad(moment.getMinutes())}`;
}
