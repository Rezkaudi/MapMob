import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ArabicDatePipe } from '../../../../shared/pipes/arabic-date.pipe';
import { ComplaintDetail } from '../../models/complaint-detail';
import { ComplaintDetailView } from '../../state/complaint-detail-view';
import { ComplaintDetailCard } from '../complaint-detail-card/complaint-detail-card';
import { ComplaintStatusPill } from '../complaint-status-pill/complaint-status-pill';

/** "بيانات البلاغ وسبب التبليغ": what was reported, the proof, and the complaint's facts. */
@Component({
  selector: 'app-complaint-content-card',
  imports: [ArabicDatePipe, ComplaintDetailCard, ComplaintStatusPill],
  templateUrl: './complaint-content-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplaintContentCard {
  readonly detail = input.required<ComplaintDetail>();
  readonly view = input.required<ComplaintDetailView>();
}
