import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ShareBarTone } from './share-bar-tone';

const MIN_SHARE = 0;
const MAX_SHARE = 100;

const TONE_BACKGROUND: Record<ShareBarTone, string> = {
  violet: 'bg-[#8200df]',
  blue: 'bg-primary',
  green: 'bg-status-success',
  amber: 'bg-accent',
  red: 'bg-status-error',
};

/** A 12px rounded track filled from the start side to a percentage. */
@Component({
  selector: 'app-share-bar',
  templateUrl: './share-bar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareBar {
  /** A percentage from 0 to 100. */
  readonly share = input.required<number>();
  readonly tone = input.required<ShareBarTone>();
  readonly label = input.required<string>();

  protected readonly fillWidth = computed(
    () => `${Math.min(MAX_SHARE, Math.max(MIN_SHARE, this.share()))}%`,
  );
  protected readonly fillBackground = computed(() => TONE_BACKGROUND[this.tone()]);
  protected readonly minShare = MIN_SHARE;
  protected readonly maxShare = MAX_SHARE;
}
