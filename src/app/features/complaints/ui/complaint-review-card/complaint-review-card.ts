import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ComplaintStatus } from '../../models/complaint-status';
import { COMPLAINT_STATUS_OPTIONS } from '../../models/complaint-status-choices';
import { ComplaintDetailCard } from '../complaint-detail-card/complaint-detail-card';

/** "مراجعة البلاغ وتحديث حالته": the admin's status pick and notes, saved from the page footer. */
@Component({
  selector: 'app-complaint-review-card',
  imports: [AppIcon, ComplaintDetailCard],
  templateUrl: './complaint-review-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplaintReviewCard {
  readonly status = input.required<ComplaintStatus>();
  readonly notes = input.required<string>();
  readonly statusChange = output<ComplaintStatus>();
  readonly notesChange = output<string>();

  protected readonly statusOptions = COMPLAINT_STATUS_OPTIONS;

  protected pickStatus(event: Event): void {
    this.statusChange.emit((event.target as HTMLSelectElement).value as ComplaintStatus);
  }

  protected typeNotes(event: Event): void {
    this.notesChange.emit((event.target as HTMLTextAreaElement).value);
  }
}
