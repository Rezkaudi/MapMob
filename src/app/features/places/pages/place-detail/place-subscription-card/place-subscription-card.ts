import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { formatShortEnglishDate } from '../../../../../shared/formatting/short-english-date';
import { InfoCard } from '../../../../../shared/ui/info-card/info-card';
import { PLACE_PACKAGE_LABEL } from '../../../models/place-package';
import { PLACE_STATUS_LABEL, PlaceStatus } from '../../../models/place-status';
import { PlaceSubscription } from '../../../models/place-subscription';
import { PlaceFactRow } from '../place-fact-row/place-fact-row';

const STATUS_TEXT_CLASS: Record<PlaceStatus, string> = {
  active: 'text-status-success',
  suspended: 'text-closed',
  pending: 'text-status-warning',
};

@Component({
  selector: 'app-place-subscription-card',
  imports: [InfoCard, PlaceFactRow],
  templateUrl: './place-subscription-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceSubscriptionCard {
  readonly subscription = input.required<PlaceSubscription>();
  readonly edit = output<void>();

  protected readonly planLabel = computed(() => PLACE_PACKAGE_LABEL[this.subscription().package]);
  protected readonly statusLabel = computed(() => PLACE_STATUS_LABEL[this.subscription().status]);
  protected readonly statusClass = computed(() => STATUS_TEXT_CLASS[this.subscription().status]);
  protected readonly renewsOn = computed(() =>
    formatShortEnglishDate(this.subscription().renewsAt),
  );
}
