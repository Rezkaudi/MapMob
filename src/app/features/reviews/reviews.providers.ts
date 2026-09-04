import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ReviewHttpRepository } from './data/review-http.repository';
import { ReviewMockRepository } from './data/review-mock.repository';
import { ReviewRepository } from './data/review.repository';

/** ⚠ The `useMockApi` branch is temporary — delete it and ReviewMockRepository once the API exists. */
export function provideReviewsFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: ReviewRepository,
      useClass: environment.useMockApi ? ReviewMockRepository : ReviewHttpRepository,
    },
  ]);
}
