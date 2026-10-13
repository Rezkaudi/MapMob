import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { isMockApiUsed } from '../../core/config/mock-api-switch';
import { OwnerReviewsHttpRepository } from './data/owner-reviews-http.repository';
import { OwnerReviewsMockRepository } from './data/owner-reviews-mock.repository';
import { OwnerReviewsRepository } from './data/owner-reviews.repository';

/** ⚠ The mock branch is temporary — delete it and the mock files once the API exists. */
export function provideMerchantReviewsFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: OwnerReviewsRepository,
      useClass: isMockApiUsed('merchant-reviews')
        ? OwnerReviewsMockRepository
        : OwnerReviewsHttpRepository,
    },
  ]);
}
