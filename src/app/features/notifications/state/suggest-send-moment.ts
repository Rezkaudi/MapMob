import { toWallClockTime } from './wall-clock-time';
import { SendMoment, splitSendAt } from './send-moment';

const TIME_ON_THE_HOUR = ':00';

/** The same hour tomorrow, on the hour: a sensible first pick for a later send. */
export function suggestSendMoment(now: Date): SendMoment {
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, now.getHours());
  const { day, time } = splitSendAt(toWallClockTime(tomorrow));
  return { day, time: `${time.slice(0, 2)}${TIME_ON_THE_HOUR}` };
}
