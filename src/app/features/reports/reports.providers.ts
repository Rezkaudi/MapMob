import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ReportsHttpRepository } from './data/reports-http.repository';
import { ReportsMockRepository } from './data/reports-mock.repository';
import { ReportsRepository } from './data/reports.repository';

/** ⚠ The `useMockApi` branch is temporary — delete it and the mock files once the API exists. */
export function provideReportsFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: ReportsRepository,
      useClass: environment.useMockApi ? ReportsMockRepository : ReportsHttpRepository,
    },
  ]);
}
