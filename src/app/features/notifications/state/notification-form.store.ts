import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, forkJoin, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withSaveStatus } from '../../../shared/state/with-save-status';
import { NotificationRepository } from '../data/notification.repository';
import { AudienceEstimate, AudienceEstimateQuery } from '../models/audience-estimate';
import { NotificationAudience } from '../models/notification-audience';
import { NotificationDetail } from '../models/notification-detail';
import { NotificationDraft } from '../models/notification-draft';
import { NotificationFormOptions } from '../models/notification-form-options';
import { NotificationRecipient } from '../models/notification-recipient';

export interface RecipientSearch {
  readonly audience: NotificationAudience;
  readonly search: string;
}

interface NotificationFormState {
  readonly editingId: string | null;
  readonly options: NotificationFormOptions | null;
  readonly editedDetail: NotificationDetail | null;
  readonly recipients: readonly NotificationRecipient[];
  readonly isRecipientsLoading: boolean;
  readonly estimate: AudienceEstimate | null;
}

const initialState: NotificationFormState = {
  editingId: null,
  options: null,
  editedDetail: null,
  recipients: [],
  isRecipientsLoading: false,
  estimate: null,
};

/** What the create and edit pages load, look up and save. */
export const NotificationFormStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withSaveStatus(),
  withComputed(({ options, editingId, editedDetail, isLoading }) => ({
    governorates: computed(() => options()?.governorates ?? []),
    isReady: computed(
      () => options() !== null && !isLoading() && (editingId() === null || editedDetail() !== null),
    ),
  })),
  withMethods((store, repository = inject(NotificationRepository)) => ({
    load: rxMethod<string | null>(
      pipe(
        tap((editingId) => {
          patchState(store, { editingId, editedDetail: null });
          store.setLoading();
        }),
        switchMap((editingId) =>
          forkJoin({
            options: repository.getFormOptions(),
            detail: editingId ? repository.getNotification(editingId) : of(null),
          }).pipe(
            tap(({ options, detail }) => {
              patchState(store, { options, editedDetail: detail });
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
    searchRecipients: rxMethod<RecipientSearch>(
      pipe(
        tap(() => patchState(store, { isRecipientsLoading: true })),
        switchMap(({ audience, search }) =>
          repository.searchRecipients(audience, search).pipe(
            tap((recipients) => patchState(store, { recipients, isRecipientsLoading: false })),
            catchError(() => {
              patchState(store, { recipients: [], isRecipientsLoading: false });
              return of(null);
            }),
          ),
        ),
      ),
    ),
    /** `null` means no governorate is picked yet, so there is nothing to estimate. */
    estimateAudience: rxMethod<AudienceEstimateQuery | null>(
      pipe(
        tap(() => patchState(store, { estimate: null })),
        switchMap((query) =>
          query
            ? repository.estimateAudience(query).pipe(
                tap((estimate) => patchState(store, { estimate })),
                catchError(() => of(null)),
              )
            : of(null),
        ),
      ),
    ),
  })),
  withMethods((store, repository = inject(NotificationRepository)) => ({
    retry(): void {
      store.load(store.editingId());
    },
    save(editingId: string | null, draft: NotificationDraft): Promise<boolean> {
      return store.runSave(
        editingId
          ? repository.updateNotification(editingId, draft)
          : repository.createNotification(draft),
      );
    },
  })),
);
