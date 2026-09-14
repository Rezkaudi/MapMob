import { PagedQuery } from '../../core/models/paged-query';
import { ListSort } from './list-sort';

export interface ListQuery extends PagedQuery {
  readonly sort?: ListSort;
}
