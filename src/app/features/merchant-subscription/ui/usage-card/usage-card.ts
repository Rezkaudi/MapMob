import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { UsageCardView } from '../../models/usage-card-view';

const ROOMY_SKIN = {
  percent: 'text-primary',
  fill: 'bg-primary',
  note: 'text-text-secondary',
  noteIcon: 'check-circle-line',
  noteIconSize: 14,
  noteIconColour: 'text-status-success',
};

const NEAR_LIMIT_SKIN = {
  percent: 'text-accent',
  fill: 'bg-accent',
  note: 'text-[#B45309]',
  noteIcon: 'info-circle-filled',
  noteIconSize: 12,
  noteIconColour: 'text-[#B45309]',
};

/** One "استخدام الباقة" card: count, share, bar and what is left. */
@Component({
  selector: 'app-usage-card',
  imports: [AppIcon],
  templateUrl: './usage-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsageCard {
  readonly card = input.required<UsageCardView>();

  protected readonly skin = computed(() =>
    this.card().isNearLimit ? NEAR_LIMIT_SKIN : ROOMY_SKIN,
  );
}
