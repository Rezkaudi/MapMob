import { computed } from '@angular/core';
import { signalStore, withComputed } from '@ngrx/signals';
import { withNotificationFeed } from '../../../shared/state/with-notification-feed';
import { OwnerNotificationsRepository } from '../data/owner-notifications.repository';
import { OwnerNotification } from '../models/owner-notification';
import { toOwnerNotificationCardView } from './owner-notification-card-view';

export const MerchantNotificationsStore = signalStore(
  { providedIn: 'root' },
  withNotificationFeed<OwnerNotification>(OwnerNotificationsRepository),
  withComputed(({ visibleNotifications }) => ({
    visibleCards: computed(() => visibleNotifications().map(toOwnerNotificationCardView)),
  })),
);
