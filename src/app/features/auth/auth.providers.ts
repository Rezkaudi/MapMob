import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthHttpRepository } from './data/auth-http.repository';
import { AuthMockRepository } from './data/auth-mock.repository';
import { AuthRepository } from './data/auth.repository';

/** ⚠ The `useMockApi` branch is temporary — delete it and AuthMockRepository once the API exists. */
export function provideAuthFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: AuthRepository,
      useClass: environment.useMockApi ? AuthMockRepository : AuthHttpRepository,
    },
  ]);
}
