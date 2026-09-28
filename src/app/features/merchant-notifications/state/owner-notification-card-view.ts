import {
  MERCHANT_HOME_ROUTE,
  MERCHANT_OFFERS_ROUTE,
  MERCHANT_REVIEWS_ROUTE,
  MERCHANT_SUBSCRIPTION_ROUTE,
} from '../../../layout/merchant-shell/merchant-nav-items';
import { NotificationCardAction } from '../../../shared/models/notification-card-action';
import { NotificationCardView } from '../../../shared/models/notification-card-view';
import { NotificationEdgeTone } from '../../../shared/models/notification-edge-tone';
import { OwnerNotification } from '../models/owner-notification';
import {
  OWNER_NOTIFICATION_CATEGORY_LABELS,
  OwnerNotificationCategory,
} from '../models/owner-notification-category';

/** The merchant frame colours الاشتراكات amber and التقييمات green; the other two take theme colours. */
const EDGE_TONES: Record<OwnerNotificationCategory, NotificationEdgeTone> = {
  subscriptions: 'amber',
  reviews: 'green',
  offers: 'primary',
  system: 'muted',
};

const ACTION_LABELS: Record<OwnerNotificationCategory, string> = {
  subscriptions: 'عرض في صفحة الاشتراكات والباقات',
  reviews: 'عرض المراجعة والرد على العميل',
  offers: 'تعديل العرض وإعادة التقديم',
  system: 'استكشاف المزايا الجديدة',
};

function actionRoute({ category, subjectId }: OwnerNotification): string {
  switch (category) {
    case 'subscriptions':
      return MERCHANT_SUBSCRIPTION_ROUTE;
    case 'reviews':
      return MERCHANT_REVIEWS_ROUTE;
    case 'offers':
      return subjectId ? `${MERCHANT_OFFERS_ROUTE}/${subjectId}/edit` : MERCHANT_OFFERS_ROUTE;
    case 'system':
      return MERCHANT_HOME_ROUTE;
  }
}

function actionFor(notification: OwnerNotification): NotificationCardAction {
  return { label: ACTION_LABELS[notification.category], route: actionRoute(notification) };
}

export function toOwnerNotificationCardView(notification: OwnerNotification): NotificationCardView {
  return {
    id: notification.id,
    title: notification.title,
    body: notification.body,
    categoryLabel: OWNER_NOTIFICATION_CATEGORY_LABELS[notification.category],
    edgeTone: EDGE_TONES[notification.category],
    receivedAt: notification.receivedAt,
    isRead: notification.isRead,
    action: actionFor(notification),
  };
}
