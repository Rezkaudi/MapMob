import { PagedQuery } from '../../../core/models/paged-query';
import { ListSort } from '../../../shared/models/list-sort';
import { GameStatus } from './game-status';

/** `search` matches the round number or the game name. */
export interface GameQuery extends PagedQuery {
  readonly status?: GameStatus;
  readonly sort?: ListSort;
}
