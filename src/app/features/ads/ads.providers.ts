import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AdHttpRepository } from './data/ad-http.repository';
import { AdMockDatabase } from './data/ad-mock-database';
import { buildAdSeed } from './data/ad-mock-seed';
import { AdMockRepository } from './data/ad-mock.repository';
import { AdRepository } from './data/ad.repository';

/** The design's summary counts 100 ads. */
const MOCK_AD_COUNT = 100;

/** ⚠ The `useMockApi` branch is temporary — delete it and the mock files once the API exists. */
export function provideAdsFeature(): EnvironmentProviders {
  if (!environment.useMockApi) {
    return makeEnvironmentProviders([{ provide: AdRepository, useClass: AdHttpRepository }]);
  }
  return makeEnvironmentProviders([
    {
      provide: AdMockDatabase,
      useFactory: () => new AdMockDatabase(buildAdSeed(new Date(), MOCK_AD_COUNT)),
    },
    { provide: AdRepository, useClass: AdMockRepository },
  ]);
}
