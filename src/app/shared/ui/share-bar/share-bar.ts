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
  yellow: 'bg-[#fbbf24]',
};

/** `regular` is the reports' 12px bar; `slim` the merchant star distribution's 10px one. */
export type ShareBarSize = 'regular' | 'slim';

const TRACK_CLASSES: Record<ShareBarSize, string> = {
  regular: 'h-3 bg-[#eceef0]',
  slim: 'h-2.5 bg-[#f1f5f9]',
};

/** A rounded track filled from the start side to a percentage. */
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
  readonly size = input<ShareBarSize>('regular');

  protected readonly fillWidth = computed(
    () => `${Math.min(MAX_SHARE, Math.max(MIN_SHARE, this.share()))}%`,
  );
  protected readonly trackClasses = computed(() => TRACK_CLASSES[this.size()]);
  protected readonly fillBackground = computed(() => TONE_BACKGROUND[this.tone()]);
  protected readonly minShare = MIN_SHARE;
  protected readonly maxShare = MAX_SHARE;
}
