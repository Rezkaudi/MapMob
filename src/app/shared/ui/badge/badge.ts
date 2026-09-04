import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BadgeTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

/** Status pills are solid with white text in the design. */
const TONE_CLASSES: Record<BadgeTone, string> = {
  success: 'bg-status-success text-white',
  warning: 'bg-status-warning text-white',
  error: 'bg-status-error text-white',
  info: 'bg-primary text-white',
  neutral: 'bg-text-secondary text-white',
};

@Component({
  selector: 'app-badge',
  templateUrl: './badge.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Badge {
  readonly tone = input<BadgeTone>('neutral');
  protected readonly toneClasses = computed(() => TONE_CLASSES[this.tone()]);
}
