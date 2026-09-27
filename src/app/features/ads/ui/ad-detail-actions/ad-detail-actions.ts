import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { AdPauseAction } from '../../models/ad-pause-action';

@Component({
  selector: 'app-ad-detail-actions',
  imports: [AppIcon],
  templateUrl: './ad-detail-actions.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdDetailActions {
  readonly pauseAction = input<AdPauseAction | null>(null);
  readonly isBusy = input<boolean>(false);
  readonly edit = output<void>();
  readonly statusChange = output<void>();
  readonly remove = output<void>();
}
