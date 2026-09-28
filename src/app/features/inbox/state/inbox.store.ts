import { computed } from '@angular/core';
import { signalStore, withComputed } from '@ngrx/signals';
import { withNotificationFeed } from '../../../shared/state/with-notification-feed';
import { InboxRepository } from '../data/inbox.repository';
import { InboxNotification } from '../models/inbox-notification';
import { toInboxCardView } from './inbox-card-view';

export const InboxStore = signalStore(
  { providedIn: 'root' },
  withNotificationFeed<InboxNotification>(InboxRepository),
  withComputed(({ visibleNotifications }) => ({
    visibleCards: computed(() => visibleNotifications().map(toInboxCardView)),
  })),
);
