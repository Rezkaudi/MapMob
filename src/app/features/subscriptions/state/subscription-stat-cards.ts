import { StatBadgeTone } from '../../../shared/ui/stat-card/stat-card';
import { SubscriptionSummary } from '../models/subscription-summary';

const PERCENT = 100;

export interface SubscriptionStatCard {
  readonly icon: string;
  readonly label: string;
  readonly value: string;
  readonly badge: string | null;
  readonly badgeTone: StatBadgeTone;
}

/** RTL draws the first card on the right, so the list runs right to left as the design reads. */
export function buildSubscriptionStatCards(
  summary: SubscriptionSummary,
): readonly SubscriptionStatCard[] {
  const activeShare = Math.round(summary.activeSubscriberShare * PERCENT);
  return [
    {
      icon: 'check-circle-outline',
      label: 'المشتركون النشطون',
      value: String(summary.activeSubscriberCount),
      badge: `${activeShare}% من الإجمالي`,
      badgeTone: 'success',
    },
    {
      icon: 'time-circle',
      label: 'ينتهي قريباً (خلال 7 أيام)',
      value: String(summary.endingSoonCount),
      badge: 'تتطلب متابعة',
      badgeTone: 'warning',
    },
    {
      icon: 'package',
      label: 'الباقات المتاحة',
      value: String(summary.availablePlanCount),
      badge: null,
      badgeTone: 'success',
    },
    {
      icon: 'trending-up',
      label: 'الباقة الأكثر طلباً',
      value: summary.topPlanName,
      badge: `${summary.topPlanSubscriberCount} مشتركاً`,
      badgeTone: 'error',
    },
  ];
}
