import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, filter, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { InboxRepository } from '../data/inbox.repository';
import { InboxNotification } from '../models/inbox-notification';
import { InboxTab } from '../models/inbox-tab';
import { filterInboxNotifications } from './filter-inbox-notifications';

interface InboxState {
  readonly notifications: readonly InboxNotification[];
  readonly tab: InboxTab;
  readonly hasLoaded: boolean;
}

/** The design marks الكل as the open tab. */
const initialState: InboxState = {
  notifications: [],
  tab: 'all',
  hasLoaded: false,
};

export const InboxStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withRequestStatus(),
  withComputed(({ notifications, tab }) => ({
    visibleNotifications: computed(() => filterInboxNotifications(notifications(), tab())),
    unreadCount: computed(
      () => notifications().filter((notification) => !notification.isRead).length,
    ),
  })),
  withComputed(({ visibleNotifications, isLoading }) => ({
    hasNoNotifications: computed(() => !isLoading() && visibleNotifications().length === 0),
  })),
  withMethods((store, repository = inject(InboxRepository)) => {
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

      /** The top bar only needs the unread count, so it does not reload a loaded inbox. */
      loadOnce(): void {
        if (!store.hasLoaded() && !store.isLoading()) {
          loadNotifications();
        }
      },

      setTab(tab: InboxTab): void {
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
