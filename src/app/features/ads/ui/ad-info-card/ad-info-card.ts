import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { AdDetail } from '../../models/ad-detail';
import { AdDetailView } from '../../state/ad-detail-view';

/** "بيانات ومعلومات الإعلان": the two-column grid of everything the ad was saved with. */
@Component({
  selector: 'app-ad-info-card',
  imports: [AppIcon, RouterLink],
  templateUrl: './ad-info-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdInfoCard {
  readonly detail = input.required<AdDetail>();
  readonly view = input.required<AdDetailView>();
}
