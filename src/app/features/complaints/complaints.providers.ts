import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ComplaintHttpRepository } from './data/complaint-http.repository';
import { ComplaintMockDatabase } from './data/complaint-mock-database';
import { buildComplaintSeed } from './data/complaint-mock-seed';
import { ComplaintMockRepository } from './data/complaint-mock.repository';
import { ComplaintRepository } from './data/complaint.repository';

/** Enough complaints for several pages of four rows. */
const MOCK_COMPLAINT_COUNT = 38;

/** ⚠ The `useMockApi` branch is temporary — delete it and the mock files once the API exists. */
export function provideComplaintsFeature(): EnvironmentProviders {
  if (!environment.useMockApi) {
    return makeEnvironmentProviders([
      { provide: ComplaintRepository, useClass: ComplaintHttpRepository },
    ]);
  }
  return makeEnvironmentProviders([
    {
      provide: ComplaintMockDatabase,
      useFactory: () =>
        new ComplaintMockDatabase(buildComplaintSeed(new Date(), MOCK_COMPLAINT_COUNT)),
    },
    { provide: ComplaintRepository, useClass: ComplaintMockRepository },
  ]);
}
