import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { NotificationRepository } from '../data/notification.repository';
import { NotificationDetail } from '../models/notification-detail';
import { buildNotificationDetailView } from './notification-detail-view';

/** The dialog shows the details first; reschedule and resend open in its place. */
export type NotificationDetailPanel = 'details' | 'reschedule' | 'resend';

interface NotificationDetailState {
  readonly openNotificationId: string | null;
  readonly detail: NotificationDetail | null;
  readonly panel: NotificationDetailPanel;
}

const initialState: NotificationDetailState = {
  openNotificationId: null,
  detail: null,
  panel: 'details',
};

export const NotificationDetailStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withComputed(({ openNotificationId, detail }, clock = inject(CLOCK)) => ({
    isOpen: computed(() => openNotificationId() !== null),
    view: computed(() => {
      const openDetail = detail();
      return openDetail ? buildNotificationDetailView(openDetail, clock()) : null;
    }),
  })),
  withMethods((store, repository = inject(NotificationRepository)) => ({
    loadDetail: rxMethod<string>(
      pipe(
        tap(() => {
          patchState(store, { detail: null });
          store.setLoading();
        }),
        switchMap((id) =>
          repository.getNotification(id).pipe(
            tap((detail) => {
              patchState(store, { detail });
              store.setLoaded();
            }),
            catchError((error: Error) => {
              store.setError(error.message);
              return of(null);
            }),
          ),
        ),
      ),
    ),
  })),
  withMethods((store) => ({
    open(id: string): void {
      patchState(store, { openNotificationId: id, panel: 'details' });
      store.loadDetail(id);
    },
    reload(): void {
      const id = store.openNotificationId();
      if (id) {
        store.loadDetail(id);
      }
    },
    showPanel(panel: NotificationDetailPanel): void {
      patchState(store, { panel });
    },
    close(): void {
      patchState(store, initialState);
    },
  })),
);
