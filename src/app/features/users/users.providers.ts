import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserHttpRepository } from './data/user-http.repository';
import { UserMockRepository } from './data/user-mock.repository';
import { UserRepository } from './data/user.repository';

/** ⚠ The `useMockApi` branch is temporary — delete it and UserMockRepository once the API exists. */
export function provideUsersFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: UserRepository,
      useClass: environment.useMockApi ? UserMockRepository : UserHttpRepository,
    },
  ]);
}
