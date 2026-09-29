import { computed } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { OwnerReview } from '../models/owner-review';

type ReviewDialog = 'details' | 'report';

interface ReviewDialogsState {
  readonly dialog: ReviewDialog | null;
  readonly dialogReview: OwnerReview | null;
}

/** Which of the two review dialogs is open, and on which review. */
export function withReviewDialogs() {
  return signalStoreFeature(
    withState<ReviewDialogsState>({ dialog: null, dialogReview: null }),
    withComputed(({ dialog, dialogReview }) => ({
      detailsReview: computed(() => (dialog() === 'details' ? dialogReview() : null)),
      reportedReview: computed(() => (dialog() === 'report' ? dialogReview() : null)),
    })),
    withMethods((store) => ({
      openDetails(review: OwnerReview): void {
        patchState(store, { dialog: 'details', dialogReview: review });
      },
      openReport(review: OwnerReview): void {
        patchState(store, { dialog: 'report', dialogReview: review });
      },
      closeDialog(): void {
        patchState(store, { dialog: null, dialogReview: null });
      },
    })),
  );
}
