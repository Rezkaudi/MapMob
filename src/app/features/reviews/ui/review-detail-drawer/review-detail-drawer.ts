import { ChangeDetectionStrategy, Component, OutputEmitterRef, input, output } from '@angular/core';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { SideDrawer } from '../../../../shared/ui/side-drawer/side-drawer';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { Review } from '../../models/review';
import { ReviewDetail } from '../../models/review-detail';
import { ModeratedReviewStatus } from '../../models/review-status';
import { ReviewDetailView } from '../../state/review-detail-view';
import { ReviewContent } from '../review-content/review-content';
import { ReviewModerationActions } from '../review-moderation-actions/review-moderation-actions';
import { ReviewPlaceCard } from '../review-place-card/review-place-card';
import { ReviewReportCard } from '../review-report-card/review-report-card';
import { ReviewerProfile } from '../reviewer-profile/reviewer-profile';

const LOADING_TITLE = 'تفاصيل المراجعة';

export interface ReviewStatusRequest {
  readonly review: Review;
  readonly status: ModeratedReviewStatus;
}

@Component({
  selector: 'app-review-detail-drawer',
  imports: [
    ErrorState,
    ReviewContent,
    ReviewModerationActions,
    ReviewPlaceCard,
    ReviewReportCard,
    ReviewerProfile,
    SideDrawer,
    Skeleton,
  ],
  templateUrl: './review-detail-drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewDetailDrawer {
  readonly detail = input.required<ReviewDetail | null>();
  readonly view = input.required<ReviewDetailView | null>();
  readonly isLoading = input<boolean>(false);
  readonly error = input<string | null>(null);
  readonly isBusy = input<boolean>(false);

  readonly closed = output<void>();
  readonly retry = output<void>();
  readonly acceptReport = output<Review>();
  readonly rejectReport = output<Review>();
  readonly statusChange = output<ReviewStatusRequest>();
  readonly remove = output<Review>();

  protected readonly loadingTitle = LOADING_TITLE;

  protected emitForOpenReview(emitter: OutputEmitterRef<Review>): void {
    const review = this.detail()?.review;
    if (review) {
      emitter.emit(review);
    }
  }

  protected emitStatusChange(status: ModeratedReviewStatus): void {
    const review = this.detail()?.review;
    if (review) {
      this.statusChange.emit({ review, status });
    }
  }
}
