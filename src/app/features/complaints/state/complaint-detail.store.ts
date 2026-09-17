import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withSaveStatus } from '../../../shared/state/with-save-status';
import { ComplaintRepository } from '../data/complaint.repository';
import { ComplaintDetail } from '../models/complaint-detail';
import { ComplaintStatus } from '../models/complaint-status';
import { buildComplaintDetailView } from './complaint-detail-view';

interface ComplaintDetailState {
  readonly detail: ComplaintDetail | null;
  /** The review card's picks, kept apart from `detail` until they are saved. */
  readonly draftStatus: ComplaintStatus | null;
  readonly draftNotes: string;
  readonly isSaved: boolean;
}

const initialState: ComplaintDetailState = {
  detail: null,
  draftStatus: null,
  draftNotes: '',
  isSaved: false,
};

function draftOf(detail: ComplaintDetail): Partial<ComplaintDetailState> {
  return { detail, draftStatus: detail.status, draftNotes: detail.adminNotes };
}

export const ComplaintDetailStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withSaveStatus(),
  withComputed(({ detail, draftStatus, draftNotes }) => ({
    view: computed(() => {
      const loaded = detail();
      return loaded ? buildComplaintDetailView(loaded) : null;
    }),
    hasUnsavedChanges: computed(() => {
      const loaded = detail();
      return (
        loaded !== null &&
        (draftStatus() !== loaded.status || draftNotes().trim() !== loaded.adminNotes)
      );
    }),
  })),
  withMethods((store, repository = inject(ComplaintRepository)) => ({
    loadComplaint: rxMethod<string>(
      pipe(
        tap(() => {
          patchState(store, initialState);
          store.setLoading();
        }),
        switchMap((id) =>
          repository.getComplaint(id).pipe(
            tap((detail) => {
              patchState(store, draftOf(detail));
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
    changeStatus(draftStatus: ComplaintStatus): void {
      patchState(store, { draftStatus, isSaved: false });
    },
    changeNotes(draftNotes: string): void {
      patchState(store, { draftNotes, isSaved: false });
    },
    async saveReview(): Promise<boolean> {
      const detail = store.detail();
      const status = store.draftStatus();
      if (!detail || !status) {
        return false;
      }
      const review = { status, adminNotes: store.draftNotes().trim() };
      const request = repository
        .saveReview(detail.id, review)
        .pipe(tap((saved) => patchState(store, draftOf(saved))));
      const isSaved = await store.runSave(request);
      patchState(store, { isSaved });
      return isSaved;
    },
    dismissSavedMessage(): void {
      patchState(store, { isSaved: false });
    },
  })),
);
