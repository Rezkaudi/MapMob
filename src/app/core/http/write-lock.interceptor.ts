import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { PageLock } from '../page-lock/page-lock';
import { SKIPS_WRITE_LOCK } from './skips-write-lock';

const READ_METHODS: readonly string[] = ['GET', 'HEAD', 'OPTIONS'];

export const writeLockInterceptor: HttpInterceptorFn = (request, next) => {
  if (READ_METHODS.includes(request.method) || request.context.get(SKIPS_WRITE_LOCK)) {
    return next(request);
  }
  const pageLock = inject(PageLock);
  pageLock.start();
  return next(request).pipe(finalize(() => pageLock.finish()));
};
