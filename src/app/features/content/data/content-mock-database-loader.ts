import { Injectable } from '@angular/core';
import { Observable, defer, from, switchMap } from 'rxjs';
import { mockRequest } from '../../../../mock/mock-delay';
import { toCalendarDay } from '../../../shared/formatting/calendar-day';
import { ContentMockDatabase } from './content-mock-database';

/** Loads the long mock copy on the first request, so it stays out of the start-up bundle. */
@Injectable()
export class ContentMockDatabaseLoader {
  private database: Promise<ContentMockDatabase> | null = null;

  request<T>(work: (database: ContentMockDatabase) => T): Observable<T> {
    return defer(() => from(this.loadDatabase())).pipe(
      switchMap((database) => mockRequest(() => work(database))),
    );
  }

  private loadDatabase(): Promise<ContentMockDatabase> {
    this.database ??= import('./content-mock-seed').then(
      ({ CONTENT_MOCK_SEED }) =>
        new ContentMockDatabase(CONTENT_MOCK_SEED, () => toCalendarDay(new Date())),
    );
    return this.database;
  }
}
