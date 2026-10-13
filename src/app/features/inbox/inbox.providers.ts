import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { isMockApiUsed } from '../../core/config/mock-api-switch';
import { InboxHttpRepository } from './data/inbox-http.repository';
import { InboxMockDatabaseLoader } from './data/inbox-mock-database-loader';
import { InboxMockRepository } from './data/inbox-mock.repository';
import { InboxRepository } from './data/inbox.repository';

/** ⚠ The mock branch is temporary — delete it and the mock files once the API exists. */
export function provideInboxFeature(): EnvironmentProviders {
  if (!isMockApiUsed('inbox')) {
    return makeEnvironmentProviders([{ provide: InboxRepository, useClass: InboxHttpRepository }]);
  }
  return makeEnvironmentProviders([
    InboxMockDatabaseLoader,
    { provide: InboxRepository, useClass: InboxMockRepository },
  ]);
}
