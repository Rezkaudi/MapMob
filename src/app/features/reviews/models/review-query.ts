import { PagedQuery } from '../../../core/models/paged-query';
import { ReviewStatus } from './review-status';

export interface ReviewQuery extends PagedQuery {
  readonly status?: ReviewStatus;
}
