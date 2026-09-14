import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

export type ConfirmTone = 'success' | 'warning' | 'danger';

interface ToneSkin {
  readonly icon: string;
  readonly halo: string;
  readonly accentText: string;
  readonly confirm: string;
}

/** Icon and colours the design gives each confirm tone. */
const TONE_SKIN: Record<ConfirmTone, ToneSkin> = {
  success: {
    icon: 'check-circle',
    halo: 'bg-status-success/16 text-status-success',
    accentText: 'text-status-success',
    confirm: 'bg-status-success',
  },
  warning: {
    icon: 'pause-circle',
    halo: 'bg-accent/16 text-accent',
    accentText: 'text-accent',
    confirm: 'bg-accent',
  },
  danger: {
    icon: 'close',
    halo: 'bg-status-error/16 text-status-error',
    accentText: 'text-status-error',
    confirm: 'bg-status-error',
  },
};

@Component({
  selector: 'app-confirm-dialog',
  imports: [AppIcon],
  templateUrl: './confirm-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly note = input<string>('');
  /** Red callout under the note, for actions that cannot be undone. */
  readonly warning = input<string>('');
  readonly confirmLabel = input.required<string>();
  readonly tone = input<ConfirmTone>('success');
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  protected readonly skin = computed(() => TONE_SKIN[this.tone()]);
}
