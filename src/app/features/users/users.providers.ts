import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { isMockApiUsed } from '../../core/config/mock-api-switch';
import { UserHttpRepository } from './data/user-http.repository';
import { UserMockDatabase } from './data/user-mock-database';
import { buildUserSeed } from './data/user-mock-seed';
import { UserMockRepository } from './data/user-mock.repository';
import { UserRepository } from './data/user.repository';

/** The design's footer counts 3000 users. */
const MOCK_USER_COUNT = 3000;

/** ⚠ The mock branch is temporary — delete it and the mock files once the API exists. */
export function provideUsersFeature(): EnvironmentProviders {
  if (!isMockApiUsed('users')) {
    return makeEnvironmentProviders([{ provide: UserRepository, useClass: UserHttpRepository }]);
  }
  return makeEnvironmentProviders([
    {
      provide: UserMockDatabase,
      useFactory: () => new UserMockDatabase(buildUserSeed(new Date(), MOCK_USER_COUNT)),
    },
    { provide: UserRepository, useClass: UserMockRepository },
  ]);
}
