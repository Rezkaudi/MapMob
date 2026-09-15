import { ActivationStatus } from '../../../shared/models/activation-status';
import { ListQuery } from '../../../shared/models/list-query';
import { UserAccountType } from './user-account-type';

export interface UserQuery extends ListQuery {
  readonly accountType?: UserAccountType;
  readonly status?: ActivationStatus;
  /** Inclusive calendar days, written `yyyy-mm-dd`. */
  readonly registeredFrom?: string;
  readonly registeredTo?: string;
}
