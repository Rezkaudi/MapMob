import { MonoTypeOperatorFunction, catchError, throwError } from 'rxjs';
import { httpStatusOf } from './http-status-of';

const UNPROCESSABLE_STATUS = 422;

/** The server explains some refusals (422) only in English, so the panel shows its own Arabic message. */
export function replaceRefusalMessage<T>(message: string): MonoTypeOperatorFunction<T> {
  return catchError((error: unknown) =>
    throwError(() =>
      httpStatusOf(error) === UNPROCESSABLE_STATUS ? new Error(message) : error,
    ),
  );
}
