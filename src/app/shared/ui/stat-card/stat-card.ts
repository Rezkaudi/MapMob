import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';
import { Skeleton } from '../skeleton/skeleton';

/** The subscriptions summary tints its chips three ways, all without an icon. */
export type StatBadgeTone = 'success' | 'warning' | 'error';

/** The complaints summary marks each status card with a coloured dot instead of the icon tile. */
export type StatDotTone = 'primary' | 'warning' | 'error' | 'success';

const BADGE_TONE_CLASSES: Record<StatBadgeTone, string> = {
  success: 'bg-status-success/16 text-status-success',
  warning: 'bg-accent/16 text-accent',
  error: 'bg-closed/16 text-closed',
};

const DOT_TONE_CLASSES: Record<StatDotTone, string> = {
  primary: 'bg-primary',
  warning: 'bg-accent',
  error: 'bg-closed',
  success: 'bg-status-success',
};

@Component({
  selector: 'app-stat-card',
  imports: [AppIcon, Skeleton],
  templateUrl: './stat-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCard {
  /** Matches a file in `public/assets/icons`. Not needed when the card shows a dot. */
  readonly icon = input<string>('');
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  /** Optional "+320 جديد" style chip shown next to the value. */
  readonly delta = input<string | null>(null);
  /** Optional red "تتطلب إجراء" style chip with a flag, for counts that need the admin. */
  readonly alert = input<string | null>(null);
  /** An iconless chip beside the value, as the subscriptions summary draws it. */
  readonly badge = input<string | null>(null);
  readonly badgeTone = input<StatBadgeTone>('success');
  /** Replaces the icon tile with a dot, as the complaints status cards draw it. */
  readonly dotTone = input<StatDotTone | null>(null);
  readonly isLoading = input<boolean>(false);

  protected readonly badgeClasses = computed(() => BADGE_TONE_CLASSES[this.badgeTone()]);
  protected readonly dotClasses = computed(() => {
    const tone = this.dotTone();
    return tone ? DOT_TONE_CLASSES[tone] : null;
  });
}
