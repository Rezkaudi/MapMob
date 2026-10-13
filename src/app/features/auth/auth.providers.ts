import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { isMockApiUsed } from '../../core/config/mock-api-switch';
import { AuthHttpRepository } from './data/auth-http.repository';
import { AuthMockRepository } from './data/auth-mock.repository';
import { AuthRepository } from './data/auth.repository';

/** ⚠ The mock branch is temporary — delete it and AuthMockRepository once the API exists. */
export function provideAuthFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: AuthRepository,
      useClass: isMockApiUsed('auth') ? AuthMockRepository : AuthHttpRepository,
    },
  ]);
}
