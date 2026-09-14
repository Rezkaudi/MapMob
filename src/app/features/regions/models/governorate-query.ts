import { PagedQuery } from '../../../core/models/paged-query';
import { RegionSort } from './region-sort';

export interface GovernorateQuery extends PagedQuery {
  readonly sort?: RegionSort;
}
