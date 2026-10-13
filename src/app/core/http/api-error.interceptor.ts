import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ApiError } from './api-error';

export const SERVER_UNREACHABLE_MESSAGE = 'تعذّر إتمام الطلب، حاول مرة أخرى';

export const apiErrorInterceptor: HttpInterceptorFn = (request, next) =>
  next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }
      return throwError(() => new ApiError(error.status, readServerMessage(error.error)));
    }),
  );

function readServerMessage(body: unknown): string {
  const message = (body as { message?: unknown } | null)?.message;
  return typeof message === 'string' && message ? message : SERVER_UNREACHABLE_MESSAGE;
}
