import { ListQuery } from '../../../shared/models/list-query';
import { ComplaintStatus } from './complaint-status';

export interface ComplaintQuery extends ListQuery {
  readonly status?: ComplaintStatus;
  /** Calendar days written `yyyy-mm-dd`. */
  readonly reportedFrom?: string;
  readonly reportedTo?: string;
}
