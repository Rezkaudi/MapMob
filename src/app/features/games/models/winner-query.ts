import { PagedQuery } from '../../../core/models/paged-query';
import { ListSort } from '../../../shared/models/list-sort';

/** `search` matches the winner's name or phone. */
export interface WinnerQuery extends PagedQuery {
  readonly gameId?: string;
  readonly sort?: ListSort;
}
