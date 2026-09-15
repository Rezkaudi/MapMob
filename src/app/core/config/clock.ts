import { InjectionToken } from '@angular/core';

export type Clock = () => Date;

/** "منذ 10 دقائق" labels read the time through this, so tests can pin it. */
export const CLOCK = new InjectionToken<Clock>('CLOCK', {
  providedIn: 'root',
  factory: () => () => new Date(),
});
