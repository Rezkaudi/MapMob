import { ProviderToken, computed, inject } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Observable, catchError, filter, of, pipe, switchMap, tap } from 'rxjs';
import { NotificationTab } from '../models/notification-tab';
import { filterNotificationsByTab } from './filter-notifications-by-tab';
import { withRequestStatus } from './with-request-status';

interface FeedNotification {
  readonly id: string;
  readonly isRead: boolean;
}

/** What a feed needs from its backend: the list, and a way to mark one read. */
export interface NotificationFeedSource<TNotification extends FeedNotification> {
  getNotifications(): Observable<readonly TNotification[]>;
  markAsRead(id: string): Observable<TNotification>;
}

interface NotificationFeedState<TNotification> {
  readonly notifications: readonly TNotification[];
  readonly tab: NotificationTab;
  readonly hasLoaded: boolean;
}

/** The tabbed, mark-as-read notification feed behind the admin inbox and the merchant page. */
export function withNotificationFeed<TNotification extends FeedNotification>(
  source: ProviderToken<NotificationFeedSource<TNotification>>,
) {
  // The frames mark الكل as the open tab.
  const initialState: NotificationFeedState<TNotification> = {
    notifications: [],
    tab: 'all',
    hasLoaded: false,
  };

  return signalStoreFeature(
    withState(initialState),
    withRequestStatus(),
    withComputed(({ notifications, tab }) => ({
      visibleNotifications: computed(() => filterNotificationsByTab(notifications(), tab())),
      unreadCount: computed(
        () => notifications().filter((notification) => !notification.isRead).length,
      ),
    })),
    withComputed(({ visibleNotifications, isLoading }) => ({
      hasNoNotifications: computed(() => !isLoading() && visibleNotifications().length === 0),
    })),
    withMethods((store, repository = inject(source)) => {
      const loadNotifications = rxMethod<void>(
        pipe(
          tap(() => store.setLoading()),
          switchMap(() =>
            repository.getNotifications().pipe(
              tap((notifications) => {
                patchState(store, { notifications, hasLoaded: true });
                store.setLoaded();
              }),
              catchError((error: Error) => {
                store.setError(error.message);
                return of(null);
              }),
            ),
          ),
        ),
      );

      return {
        loadNotifications,

        /** The top bar only needs the unread count, so it does not reload a loaded feed. */
        loadOnce(): void {
          if (!store.hasLoaded() && !store.isLoading()) {
            loadNotifications();
          }
        },

        setTab(tab: NotificationTab): void {
          patchState(store, { tab });
        },

        /** A card only reports "read" once; a second click must not call the API again. */
        markAsRead: rxMethod<string>(
          pipe(
            filter((id) => store.notifications().some((one) => one.id === id && !one.isRead)),
            switchMap((id) =>
              repository.markAsRead(id).pipe(
                tap((updated) =>
                  patchState(store, {
                    notifications: store
                      .notifications()
                      .map((notification) =>
                        notification.id === updated.id ? updated : notification,
                      ),
                  }),
                ),
                catchError((error: Error) => {
                  store.setError(error.message);
                  return of(null);
                }),
              ),
            ),
          ),
        ),
      };
    }),
  );
}
