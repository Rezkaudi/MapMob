import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withSaveStatus } from '../../../shared/state/with-save-status';
import { NotificationAlertsRepository } from '../data/notification-alerts.repository';
import { NotificationAlert } from '../models/notification-alert';
import { NotificationAlertKind } from '../models/notification-alert-kind';

interface NotificationAlertsState {
  readonly alerts: readonly NotificationAlert[];
}

const initialState: NotificationAlertsState = { alerts: [] };

export const NotificationAlertsStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withSaveStatus(),
  withMethods((store, repository = inject(NotificationAlertsRepository)) => {
    const setEnabled = (kind: NotificationAlertKind, isEnabled: boolean) =>
      patchState(store, {
        alerts: store.alerts().map((alert) => (alert.kind === kind ? { kind, isEnabled } : alert)),
      });

    return {
      loadAlerts: rxMethod<void>(
        pipe(
          tap(() => store.setLoading()),
          switchMap(() =>
            repository.getAlerts().pipe(
              tap((alerts) => {
                patchState(store, { alerts });
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
      /** Flips the switch at once; puts it back if the server refuses. */
      async setAlertEnabled(kind: NotificationAlertKind, isEnabled: boolean): Promise<boolean> {
        setEnabled(kind, isEnabled);
        const isSaved = await store.runSave(repository.setAlertEnabled(kind, isEnabled));
        if (!isSaved) {
          setEnabled(kind, !isEnabled);
        }
        return isSaved;
      },
    };
  }),
);
