import { ListQuery } from '../../../shared/models/list-query';
import { PlanTier } from './plan-tier';
import { SubscriptionStatus } from './subscription-status';

export interface SubscriptionQuery extends ListQuery {
  readonly tier?: PlanTier;
  readonly status?: SubscriptionStatus;
  /** Keeps subscriptions that started inside this inclusive range, written `yyyy-mm-dd`. */
  readonly subscribedFrom?: string;
  readonly subscribedTo?: string;
}
