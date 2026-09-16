import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { OfferHttpRepository } from './data/offer-http.repository';
import { OfferMockDatabase } from './data/offer-mock-database';
import { buildOfferSeed } from './data/offer-mock-seed';
import { OfferMockRepository } from './data/offer-mock.repository';
import { OfferRepository } from './data/offer.repository';

/** Enough offers for several pages of four rows. */
const MOCK_OFFER_COUNT = 60;

/** ⚠ The `useMockApi` branch is temporary — delete it and the mock files once the API exists. */
export function provideOffersFeature(): EnvironmentProviders {
  if (!environment.useMockApi) {
    return makeEnvironmentProviders([{ provide: OfferRepository, useClass: OfferHttpRepository }]);
  }
  return makeEnvironmentProviders([
    {
      provide: OfferMockDatabase,
      useFactory: () => new OfferMockDatabase(buildOfferSeed(new Date(), MOCK_OFFER_COUNT)),
    },
    { provide: OfferRepository, useClass: OfferMockRepository },
  ]);
}
