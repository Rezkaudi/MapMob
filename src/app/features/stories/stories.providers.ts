import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { StoryHttpRepository } from './data/story-http.repository';
import { StoryMockRepository } from './data/story-mock.repository';
import { StoryRepository } from './data/story.repository';

/** ⚠ The `useMockApi` branch is temporary — delete it and the mock files once the API exists. */
export function provideStoriesFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: StoryRepository,
      useClass: environment.useMockApi ? StoryMockRepository : StoryHttpRepository,
    },
  ]);
}
