import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { OfferPauseAction } from '../../state/offer-detail-view';

@Component({
  selector: 'app-offer-detail-actions',
  imports: [AppIcon],
  templateUrl: './offer-detail-actions.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferDetailActions {
  readonly pauseAction = input<OfferPauseAction | null>(null);
  readonly isBusy = input<boolean>(false);
  readonly edit = output<void>();
  readonly pause = output<void>();
  readonly resume = output<void>();
  readonly remove = output<void>();
}
