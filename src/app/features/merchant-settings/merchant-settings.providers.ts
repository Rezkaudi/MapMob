import { EnvironmentProviders, Provider, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AccountRepository } from '../settings/data/account.repository';
import { OwnerAccountHttpRepository } from './data/owner-account-http.repository';
import { OwnerAccountMockRepository } from './data/owner-account-mock.repository';
import { OwnerAccountRepository } from './data/owner-account.repository';

/** ⚠ The `useMockApi` branch is temporary — delete it and the mock repository once the API exists. */
export function provideMerchantSettingsFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: OwnerAccountRepository,
      useClass: environment.useMockApi ? OwnerAccountMockRepository : OwnerAccountHttpRepository,
    },
  ]);
}

/** The shared account forms ask for AccountRepository; on the merchant route that is the owner's. */
export const OWNER_ACCOUNT_ROUTE_PROVIDERS: Provider[] = [
  { provide: AccountRepository, useExisting: OwnerAccountRepository },
];
