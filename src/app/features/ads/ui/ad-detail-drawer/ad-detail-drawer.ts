import { ChangeDetectionStrategy, Component, OutputEmitterRef, input, output } from '@angular/core';
import { CampaignStatusPill } from '../../../../shared/ui/campaign-status-pill/campaign-status-pill';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { SideDrawer } from '../../../../shared/ui/side-drawer/side-drawer';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { Ad } from '../../models/ad';
import { AdDetail } from '../../models/ad-detail';
import { AdDetailView } from '../../state/ad-detail-view';
import { AdDetailActions } from '../ad-detail-actions/ad-detail-actions';
import { AdDetailFacts } from '../ad-detail-facts/ad-detail-facts';
import { AdMediaPreview } from '../ad-media-preview/ad-media-preview';

@Component({
  selector: 'app-ad-detail-drawer',
  imports: [
    AdDetailActions,
    AdDetailFacts,
    AdMediaPreview,
    CampaignStatusPill,
    ErrorState,
    SideDrawer,
    Skeleton,
  ],
  templateUrl: './ad-detail-drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdDetailDrawer {
  readonly detail = input.required<AdDetail | null>();
  readonly view = input.required<AdDetailView | null>();
  readonly isLoading = input<boolean>(false);
  readonly error = input<string | null>(null);
  readonly isBusy = input<boolean>(false);

  readonly closed = output<void>();
  readonly retry = output<void>();
  readonly edit = output<Ad>();
  readonly statusChange = output<Ad>();
  readonly remove = output<Ad>();

  protected emitForOpenAd(emitter: OutputEmitterRef<Ad>): void {
    const ad = this.detail()?.ad;
    if (ad) {
      emitter.emit(ad);
    }
  }
}
