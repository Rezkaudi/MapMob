import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { InboxHttpRepository } from './data/inbox-http.repository';
import { InboxMockDatabaseLoader } from './data/inbox-mock-database-loader';
import { InboxMockRepository } from './data/inbox-mock.repository';
import { InboxRepository } from './data/inbox.repository';

/** ⚠ The `useMockApi` branch is temporary — delete it and the mock files once the API exists. */
export function provideInboxFeature(): EnvironmentProviders {
  if (!environment.useMockApi) {
    return makeEnvironmentProviders([{ provide: InboxRepository, useClass: InboxHttpRepository }]);
  }
  return makeEnvironmentProviders([
    InboxMockDatabaseLoader,
    { provide: InboxRepository, useClass: InboxMockRepository },
  ]);
}
