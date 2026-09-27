import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CampaignStatusPill } from '../../../../shared/ui/campaign-status-pill/campaign-status-pill';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { AdDetail } from '../../models/ad-detail';
import { AdDetailView } from '../../state/ad-detail-view';
import { AdDetailActions } from '../ad-detail-actions/ad-detail-actions';

/** The banner across the top of the detail page: thumbnail, title, where it runs, actions. */
@Component({
  selector: 'app-ad-overview-card',
  imports: [AdDetailActions, AppIcon, CampaignStatusPill],
  templateUrl: './ad-overview-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdOverviewCard {
  readonly detail = input.required<AdDetail>();
  readonly view = input.required<AdDetailView>();
  readonly isBusy = input<boolean>(false);

  readonly edit = output<void>();
  readonly statusChange = output<void>();
  readonly remove = output<void>();
}
