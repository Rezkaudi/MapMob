import { PagedQuery } from '../../../core/models/paged-query';
import { PlacePackage } from './place-package';
import { PlaceStatus } from './place-status';
import { PlaceSort } from './place-sort';

export interface PlaceQuery extends PagedQuery {
  readonly status?: PlaceStatus;
  readonly category?: string;
  readonly package?: PlacePackage;
  readonly sort?: PlaceSort;
}
