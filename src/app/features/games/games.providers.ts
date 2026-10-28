import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { isMockApiUsed } from '../../core/config/mock-api-switch';
import { GameHttpRepository } from './data/game-http.repository';
import { GameMockRepository } from './data/game-mock.repository';
import { GameRepository } from './data/game.repository';

/** ⚠ The mock branch stays for offline work; the live server answers every games call. */
export function provideGamesFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: GameRepository,
      useClass: isMockApiUsed('games') ? GameMockRepository : GameHttpRepository,
    },
  ]);
}
