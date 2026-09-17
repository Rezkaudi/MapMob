import { ListQuery } from '../../../shared/models/list-query';
import { NotificationAudience } from './notification-audience';
import { NotificationKind } from './notification-kind';
import { NotificationStatus } from './notification-status';

export interface NotificationQuery extends ListQuery {
  readonly audience?: NotificationAudience;
  readonly kind?: NotificationKind;
  readonly status?: NotificationStatus;
  /** Calendar days written `yyyy-mm-dd`. */
  readonly sentFrom?: string;
  readonly sentTo?: string;
}
