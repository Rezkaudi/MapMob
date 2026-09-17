import { Injectable } from '@angular/core';
import { Observable, defer, from, switchMap } from 'rxjs';
import { mockRequest } from '../../../../mock/mock-delay';
import type { SettingsMockDatabase } from './settings-mock-database';

/** Loads the mock records and seed on the first request, so their copy stays out of the start-up bundle. */
@Injectable()
export class SettingsMockDatabaseLoader {
  private database: Promise<SettingsMockDatabase> | null = null;

  request<T>(work: (database: SettingsMockDatabase) => T): Observable<T> {
    return defer(() => from(this.loadDatabase())).pipe(
      switchMap((database) => mockRequest(() => work(database))),
    );
  }

  private loadDatabase(): Promise<SettingsMockDatabase> {
    this.database ??= Promise.all([
      import('./settings-mock-database'),
      import('./settings-mock-seed'),
    ]).then(
      ([{ SettingsMockDatabase }, { SETTINGS_MOCK_SEED }]) =>
        new SettingsMockDatabase(SETTINGS_MOCK_SEED),
    );
    return this.database;
  }
}
