import { SubscriptionStatus } from '../../../shared/models/subscription-status';
import { StatusCopy } from '../models/status-copy';

/** Feminine, to agree with "الباقة". */
export const SUBSCRIPTION_STATUS_COPY: Record<SubscriptionStatus, StatusCopy> = {
  active: { label: 'نشطة', tone: 'success' },
  paused: { label: 'متوقفة', tone: 'warning' },
  expired: { label: 'منتهية', tone: 'muted' },
};
