import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ModeratedReviewStatus } from '../../models/review-status';
import { ReviewModeration } from '../../state/review-detail-view';

@Component({
  selector: 'app-review-moderation-actions',
  imports: [AppIcon],
  templateUrl: './review-moderation-actions.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewModerationActions {
  readonly moderation = input.required<ReviewModeration>();
  readonly isBusy = input<boolean>(false);
  readonly acceptReport = output<void>();
  readonly rejectReport = output<void>();
  readonly statusChange = output<ModeratedReviewStatus>();
  readonly remove = output<void>();
}
