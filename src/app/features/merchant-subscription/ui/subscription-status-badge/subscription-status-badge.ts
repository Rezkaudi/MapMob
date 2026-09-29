import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { StatusCopy, StatusTone } from '../../models/status-copy';

interface BadgeSkin {
  readonly badge: string;
  readonly dot: string;
}

const BADGE_SKINS: Record<StatusTone, BadgeSkin> = {
  success: {
    badge: 'border-status-success/30 bg-status-success/16 text-status-success',
    dot: 'bg-status-success',
  },
  warning: { badge: 'border-accent/30 bg-accent/16 text-[#B45309]', dot: 'bg-accent' },
  muted: {
    badge: 'border-text-secondary/30 bg-text-secondary/16 text-text-secondary',
    dot: 'bg-text-secondary',
  },
};

/** The tinted "● نشطة" badge of the hero card and the details dialog. */
@Component({
  selector: 'app-subscription-status-badge',
  templateUrl: './subscription-status-badge.html',
  host: { class: 'inline-flex' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionStatusBadge {
  readonly status = input.required<StatusCopy>();

  protected readonly skin = computed(() => BADGE_SKINS[this.status().tone]);
}
