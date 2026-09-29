import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { formatReviewRating } from '../../../../shared/formatting/review-rating-label';
import { ArabicDatePipe } from '../../../../shared/pipes/arabic-date.pipe';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { FormDialogFrame } from '../../../../shared/ui/form-dialog-frame/form-dialog-frame';
import { StarRating } from '../../../../shared/ui/star-rating/star-rating';
import { OwnerReview } from '../../models/owner-review';

const MISSING_RATING_LABEL = '—';
const TOP_RATING_LABEL = '/5.0';

/** "تفاصيل المراجعة": the whole comment, with a way on to report it. */
@Component({
  selector: 'app-review-details-dialog',
  imports: [AppIcon, ArabicDatePipe, FormDialogFrame, StarRating],
  templateUrl: './review-details-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewDetailsDialog {
  readonly review = input.required<OwnerReview>();
  readonly closed = output<void>();
  readonly report = output<void>();

  protected readonly topRatingLabel = TOP_RATING_LABEL;
  protected readonly scoreText = computed(
    () => formatReviewRating(this.review().rating) ?? MISSING_RATING_LABEL,
  );
  protected readonly canReport = computed(() => this.review().reportStatus === 'none');
}
