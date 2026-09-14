import { Observable, defer, delay, of } from 'rxjs';

const MIN_DELAY_MS = 250;
const MAX_DELAY_MS = 600;

/** Wraps a mock value in an Observable with a fake, randomized network delay. */
export function mockResponse<T>(value: T): Observable<T> {
  const latency = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
  return of(value).pipe(delay(latency));
}

/** Runs the mock work on subscribe, so a thrown error reaches the caller as an error event. */
export function mockRequest<T>(work: () => T): Observable<T> {
  return defer(() => mockResponse(work()));
}
