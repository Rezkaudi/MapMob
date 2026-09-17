import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ComplaintReporter } from '../../models/complaint-reporter';
import { ComplaintDetailCard } from '../complaint-detail-card/complaint-detail-card';

@Component({
  selector: 'app-complaint-reporter-card',
  imports: [AppIcon, ComplaintDetailCard, RouterLink],
  templateUrl: './complaint-reporter-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplaintReporterCard {
  readonly reporter = input.required<ComplaintReporter>();
  readonly profileLink = input.required<string>();
}
