import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';
import { Skeleton } from '../skeleton/skeleton';

/** The subscriptions summary tints its chips three ways, all without an icon. */
export type StatBadgeTone = 'success' | 'warning' | 'error';

const BADGE_TONE_CLASSES: Record<StatBadgeTone, string> = {
  success: 'bg-status-success/16 text-status-success',
  warning: 'bg-accent/16 text-accent',
  error: 'bg-closed/16 text-closed',
};

@Component({
  selector: 'app-stat-card',
  imports: [AppIcon, Skeleton],
  templateUrl: './stat-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCard {
  /** Matches a file in `public/assets/icons`. */
  readonly icon = input.required<string>();
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  /** Optional "+320 جديد" style chip shown next to the value. */
  readonly delta = input<string | null>(null);
  /** Optional red "تتطلب إجراء" style chip with a flag, for counts that need the admin. */
  readonly alert = input<string | null>(null);
  /** An iconless chip beside the value, as the subscriptions summary draws it. */
  readonly badge = input<string | null>(null);
  readonly badgeTone = input<StatBadgeTone>('success');
  readonly isLoading = input<boolean>(false);

  protected readonly badgeClasses = computed(() => BADGE_TONE_CLASSES[this.badgeTone()]);
}
