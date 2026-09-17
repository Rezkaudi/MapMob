/** The two halves of a `yyyy-mm-ddThh:mm` send time, as the date and time inputs hold them. */
export interface SendMoment {
  /** `yyyy-mm-dd`. */
  readonly day: string;
  /** `hh:mm`, 24-hour. */
  readonly time: string;
}

const SEPARATOR = 'T';

export function splitSendAt(sendAt: string): SendMoment {
  const [day, time] = sendAt.split(SEPARATOR);
  return { day, time };
}

export function joinSendAt(moment: SendMoment): string {
  return `${moment.day}${SEPARATOR}${moment.time}`;
}

/** A local `Date` for the wall-clock send time, for distance maths. */
export function toSendDate(sendAt: string): Date {
  const { day, time } = splitSendAt(sendAt);
  const [year, month, date] = day.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  return new Date(year, month - 1, date, hours, minutes);
}
