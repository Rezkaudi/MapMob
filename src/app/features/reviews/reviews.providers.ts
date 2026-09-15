import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ReviewHttpRepository } from './data/review-http.repository';
import { ReviewMockDatabase } from './data/review-mock-database';
import { buildReviewSeed } from './data/review-mock-seed';
import { ReviewMockRepository } from './data/review-mock.repository';
import { ReviewRepository } from './data/review.repository';

/** The design's summary counts 3000 reviews. */
const MOCK_REVIEW_COUNT = 3000;

/** ⚠ The `useMockApi` branch is temporary — delete it and the mock files once the API exists. */
export function provideReviewsFeature(): EnvironmentProviders {
  if (!environment.useMockApi) {
    return makeEnvironmentProviders([
      { provide: ReviewRepository, useClass: ReviewHttpRepository },
    ]);
  }
  return makeEnvironmentProviders([
    {
      provide: ReviewMockDatabase,
      useFactory: () => new ReviewMockDatabase(buildReviewSeed(new Date(), MOCK_REVIEW_COUNT)),
    },
    { provide: ReviewRepository, useClass: ReviewMockRepository },
  ]);
}
