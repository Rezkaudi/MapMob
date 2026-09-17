import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ContentMockDatabaseLoader } from './data/content-mock-database-loader';
import { ContentPageHttpRepository } from './data/content-page-http.repository';
import { ContentPageMockRepository } from './data/content-page-mock.repository';
import { ContentPageRepository } from './data/content-page.repository';
import { FaqHttpRepository } from './data/faq-http.repository';
import { FaqMockRepository } from './data/faq-mock.repository';
import { FaqRepository } from './data/faq.repository';

/** ⚠ The `useMockApi` branch is temporary — delete it and the mock files once the API exists. */
export function provideContentFeature(): EnvironmentProviders {
  if (!environment.useMockApi) {
    return makeEnvironmentProviders([
      { provide: ContentPageRepository, useClass: ContentPageHttpRepository },
      { provide: FaqRepository, useClass: FaqHttpRepository },
    ]);
  }
  return makeEnvironmentProviders([
    ContentMockDatabaseLoader,
    { provide: ContentPageRepository, useClass: ContentPageMockRepository },
    { provide: FaqRepository, useClass: FaqMockRepository },
  ]);
}
