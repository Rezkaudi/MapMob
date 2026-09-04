import { PagedQuery } from '../../../core/models/paged-query';
import { PlaceStatus } from './place-status';

export interface PlaceQuery extends PagedQuery {
  readonly status?: PlaceStatus;
}
