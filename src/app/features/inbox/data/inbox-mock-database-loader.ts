import { Injectable } from '@angular/core';
import { Observable, defer, from, switchMap } from 'rxjs';
import { mockRequest } from '../../../../mock/mock-delay';
import { InboxMockDatabase } from './inbox-mock-database';

/** Loads the mock copy on the first request, so it stays out of the start-up bundle. */
@Injectable()
export class InboxMockDatabaseLoader {
  private database: Promise<InboxMockDatabase> | null = null;

  request<T>(work: (database: InboxMockDatabase) => T): Observable<T> {
    return defer(() => from(this.loadDatabase())).pipe(
      switchMap((database) => mockRequest(() => work(database))),
    );
  }

  private loadDatabase(): Promise<InboxMockDatabase> {
    this.database ??= import('./inbox-mock-seed').then(
      ({ buildInboxSeed }) => new InboxMockDatabase(buildInboxSeed(new Date())),
    );
    return this.database;
  }
}
