import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ReportedPlace } from '../../models/reported-place';
import { ComplaintDetailView } from '../../state/complaint-detail-view';
import { ComplaintDetailCard } from '../complaint-detail-card/complaint-detail-card';

/** "المحتوى المُبلّغ عنه": a small preview of the place the complaint is about. */
@Component({
  selector: 'app-reported-place-card',
  imports: [AppIcon, ComplaintDetailCard, RouterLink],
  templateUrl: './reported-place-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportedPlaceCard {
  readonly place = input.required<ReportedPlace>();
  readonly view = input.required<ComplaintDetailView>();
}
