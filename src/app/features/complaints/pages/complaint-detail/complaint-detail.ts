import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { FormPageHeading } from '../../../../shared/ui/form-page-heading/form-page-heading';
import { Toast } from '../../../../shared/ui/toast/toast';
import { ComplaintDetailStore } from '../../state/complaint-detail.store';
import { ComplaintContentCard } from '../../ui/complaint-content-card/complaint-content-card';
import { ComplaintDetailSkeleton } from '../../ui/complaint-detail-skeleton/complaint-detail-skeleton';
import { ComplaintReporterCard } from '../../ui/complaint-reporter-card/complaint-reporter-card';
import { ComplaintReviewCard } from '../../ui/complaint-review-card/complaint-review-card';
import { ReportedPlaceCard } from '../../ui/reported-place-card/reported-place-card';

@Component({
  selector: 'app-complaint-detail',
  imports: [
    AppIcon,
    ComplaintContentCard,
    ComplaintDetailSkeleton,
    ComplaintReporterCard,
    ComplaintReviewCard,
    ErrorState,
    FormPageHeading,
    ReportedPlaceCard,
    Toast,
  ],
  templateUrl: './complaint-detail.html',
  providers: [ComplaintDetailStore],
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplaintDetailPage {
  /** Bound from the `:id` route parameter. */
  readonly id = input.required<string>();

  protected readonly store = inject(ComplaintDetailStore);

  constructor() {
    this.store.loadComplaint(this.id);
  }

  protected reload(): void {
    this.store.loadComplaint(this.id());
  }
}
