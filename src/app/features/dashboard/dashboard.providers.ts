import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { isMockApiUsed } from '../../core/config/mock-api-switch';
import { DashboardHttpRepository } from './data/dashboard-http.repository';
import { DashboardMockRepository } from './data/dashboard-mock.repository';
import { DashboardRepository } from './data/dashboard.repository';

/** ⚠ The mock branch is temporary — delete it and DashboardMockRepository once the API exists. */
export function provideDashboardFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: DashboardRepository,
      useClass: isMockApiUsed('dashboard') ? DashboardMockRepository : DashboardHttpRepository,
    },
  ]);
}
