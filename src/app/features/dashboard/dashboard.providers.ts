import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DashboardHttpRepository } from './data/dashboard-http.repository';
import { DashboardMockRepository } from './data/dashboard-mock.repository';
import { DashboardRepository } from './data/dashboard.repository';

/** ⚠ The `useMockApi` branch is temporary — delete it and DashboardMockRepository once the API exists. */
export function provideDashboardFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: DashboardRepository,
      useClass: environment.useMockApi ? DashboardMockRepository : DashboardHttpRepository,
    },
  ]);
}
