import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { isMockApiUsed } from '../../core/config/mock-api-switch';
import { StoryHttpRepository } from './data/story-http.repository';
import { StoryMockRepository } from './data/story-mock.repository';
import { StoryRepository } from './data/story.repository';

/** ⚠ The mock branch is temporary — delete it and the mock files once the API exists. */
export function provideStoriesFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: StoryRepository,
      useClass: isMockApiUsed('stories') ? StoryMockRepository : StoryHttpRepository,
    },
  ]);
}
