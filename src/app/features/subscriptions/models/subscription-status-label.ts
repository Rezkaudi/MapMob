import { SubscriptionStatus } from '../../../shared/models/subscription-status';

export const SUBSCRIPTION_STATUS_LABEL: Record<SubscriptionStatus, string> = {
  active: 'نشط',
  paused: 'متوقف',
  expired: 'منتهي',
};
