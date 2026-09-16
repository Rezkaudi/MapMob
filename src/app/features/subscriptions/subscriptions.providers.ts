import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PlanMockDatabase } from './data/plan-mock-database';
import { MOCK_PLANS } from './data/plan-mock-samples';
import { SubscriptionHttpRepository } from './data/subscription-http.repository';
import { SubscriptionMockRepository } from './data/subscription-mock.repository';
import { SubscriptionMockDatabase } from './data/subscription-mock-database';
import { buildSubscriptionSeed } from './data/subscription-mock-seed';
import { SubscriptionRepository } from './data/subscription.repository';

/** The design's pagination counts 3000 subscribed companies. */
const MOCK_SUBSCRIPTION_COUNT = 3000;

/** ⚠ The `useMockApi` branch is temporary — delete it and the mock files once the API exists. */
export function provideSubscriptionsFeature(): EnvironmentProviders {
  if (!environment.useMockApi) {
    return makeEnvironmentProviders([
      { provide: SubscriptionRepository, useClass: SubscriptionHttpRepository },
    ]);
  }
  return makeEnvironmentProviders([
    { provide: PlanMockDatabase, useFactory: () => new PlanMockDatabase(MOCK_PLANS) },
    {
      provide: SubscriptionMockDatabase,
      useFactory: () =>
        new SubscriptionMockDatabase(buildSubscriptionSeed(new Date(), MOCK_SUBSCRIPTION_COUNT)),
    },
    { provide: SubscriptionRepository, useClass: SubscriptionMockRepository },
  ]);
}
