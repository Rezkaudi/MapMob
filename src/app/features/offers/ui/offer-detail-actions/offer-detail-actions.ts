import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { CampaignPauseAction } from '../../../../shared/models/campaign-pause-action';

@Component({
  selector: 'app-offer-detail-actions',
  imports: [AppIcon],
  templateUrl: './offer-detail-actions.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferDetailActions {
  readonly pauseAction = input<CampaignPauseAction | null>(null);
  readonly isBusy = input<boolean>(false);
  readonly edit = output<void>();
  readonly pause = output<void>();
  readonly resume = output<void>();
  readonly remove = output<void>();
}
