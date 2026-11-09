import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';
import { ApiError } from './api-error';

export const SERVER_UNREACHABLE_MESSAGE = 'تعذّر إتمام الطلب، حاول مرة أخرى';

export const apiErrorInterceptor: HttpInterceptorFn = (request, next) =>
  next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }
      return readErrorBody(error.error).pipe(
        switchMap((body) => throwError(() => new ApiError(error.status, readServerMessage(body)))),
      );
    }),
  );

// A file download gets its error body as a file too, so its text is read first.
function readErrorBody(body: unknown): Observable<unknown> {
  if (!(body instanceof Blob)) {
    return from([body]);
  }
  return from(body.text().then(parseJsonOrNull));
}

function parseJsonOrNull(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function readServerMessage(body: unknown): string {
  const message = (body as { message?: unknown } | null)?.message;
  return typeof message === 'string' && message ? message : SERVER_UNREACHABLE_MESSAGE;
}
