import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ReviewReport } from '../../models/review-report';

@Component({
  selector: 'app-review-report-card',
  imports: [AppIcon],
  templateUrl: './review-report-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewReportCard {
  readonly report = input.required<ReviewReport>();
}
