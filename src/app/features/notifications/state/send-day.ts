const CALENDAR_DAY_LENGTH = 'yyyy-mm-dd'.length;

/** Cuts the day out of the wall-clock send time, so no time zone can move it. */
export function toSendDay(sendAt: string | null): string | null {
  return sendAt?.slice(0, CALENDAR_DAY_LENGTH) ?? null;
}
