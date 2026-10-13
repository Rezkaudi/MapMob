import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { isMockApiUsed } from '../../core/config/mock-api-switch';
import { ReportsHttpRepository } from './data/reports-http.repository';
import { ReportsMockRepository } from './data/reports-mock.repository';
import { ReportsRepository } from './data/reports.repository';

/** ⚠ The mock branch is temporary — delete it and the mock files once the API exists. */
export function provideReportsFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: ReportsRepository,
      useClass: isMockApiUsed('reports') ? ReportsMockRepository : ReportsHttpRepository,
    },
  ]);
}
