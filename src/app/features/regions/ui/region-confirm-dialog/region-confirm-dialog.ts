import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  input,
  output,
} from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { RegionConfirmCopy, RegionConfirmTone } from '../region-confirm-copy';

interface ToneSkin {
  readonly icon: string;
  readonly iconSize: number;
  readonly halo: string;
  readonly confirm: string;
}

/** Glyph sizes keep the 25px tick and the 14px cross the design draws inside the 64px halo. */
const TONE_SKINS: Record<RegionConfirmTone, ToneSkin> = {
  success: {
    icon: 'check-circle',
    iconSize: 25,
    halo: 'bg-status-success/16 text-status-success',
    confirm: 'bg-status-success hover:bg-status-success/90',
  },
  danger: {
    icon: 'close-bold',
    iconSize: 22,
    halo: 'bg-closed/16 text-closed',
    confirm: 'bg-closed hover:bg-closed/90',
  },
};

@Component({
  selector: 'app-region-confirm-dialog',
  imports: [AppIcon],
  templateUrl: './region-confirm-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionConfirmDialog {
  readonly copy = input.required<RegionConfirmCopy>();
  readonly isBusy = input<boolean>(false);
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  protected readonly skin = computed(() => TONE_SKINS[this.copy().tone]);

  @HostListener('document:keydown.escape')
  protected cancelOnEscape(): void {
    this.cancelled.emit();
  }
}
