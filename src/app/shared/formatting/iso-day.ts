const ISO_DAY_LENGTH = 10;

/** The `yyyy-mm-dd` part of a server moment, read as written. */
export function toIsoDay(moment: string): string {
  return moment.slice(0, ISO_DAY_LENGTH);
}
