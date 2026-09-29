import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { OwnerReviewsHttpRepository } from './data/owner-reviews-http.repository';
import { OwnerReviewsMockRepository } from './data/owner-reviews-mock.repository';
import { OwnerReviewsRepository } from './data/owner-reviews.repository';

/** ⚠ The `useMockApi` branch is temporary — delete it and the mock files once the API exists. */
export function provideMerchantReviewsFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: OwnerReviewsRepository,
      useClass: environment.useMockApi ? OwnerReviewsMockRepository : OwnerReviewsHttpRepository,
    },
  ]);
}
