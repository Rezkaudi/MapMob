import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  input,
  output,
} from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';
import {
  ConfirmActionCopy,
  ConfirmActionTone,
  ConfirmDetailAppearance,
} from './confirm-action-copy';

interface ToneSkin {
  readonly icon: string;
  readonly iconSize: number;
  readonly halo: string;
  readonly confirm: string;
  /** The detail line takes this colour under the `toned` appearance. */
  readonly detailText: string;
}

/** Glyph sizes keep the 25px tick and the 14px cross the design draws inside the 64px halo. */
const TONE_SKINS: Record<ConfirmActionTone, ToneSkin> = {
  success: {
    icon: 'check-circle',
    iconSize: 25,
    halo: 'bg-status-success/16 text-status-success',
    confirm: 'bg-status-success hover:bg-status-success/90',
    detailText: 'text-status-success',
  },
  danger: {
    icon: 'close-bold',
    iconSize: 22,
    halo: 'bg-closed/16 text-closed',
    confirm: 'bg-closed hover:bg-closed/90',
    detailText: 'text-closed',
  },
  warning: {
    icon: 'pause-circle',
    iconSize: 25,
    halo: 'bg-accent/16 text-accent',
    confirm: 'bg-accent hover:bg-accent/90',
    detailText: 'text-accent',
  },
  critical: {
    icon: 'close-stroke',
    iconSize: 25,
    halo: 'bg-status-error/16 text-status-error',
    confirm: 'bg-status-error hover:bg-status-error/90',
    detailText: 'text-status-error',
  },
};

interface DetailSkin {
  readonly question: string;
  readonly detail: string;
  readonly actions: string;
  /** `false` where the detail keeps its own colour instead of the tone's. */
  readonly followsTone: boolean;
}

const DETAIL_SKINS: Record<ConfirmDetailAppearance, DetailSkin> = {
  muted: {
    question: 'pb-1',
    detail: 'pb-1 text-[16px]/[24px] text-text-secondary',
    actions: 'mt-[53px]',
    followsTone: false,
  },
  toned: {
    question: 'pb-1',
    detail: 'pb-8 text-[14px]/[21px]',
    actions: '',
    followsTone: true,
  },
  callout: {
    question: 'mt-2 pb-1',
    detail:
      'mt-1 flex h-[47px] w-full items-center justify-start rounded border border-[#fecaca] bg-[rgba(254,242,242,0.7)] px-4 text-start text-[14px]/[20px] font-bold text-status-error',
    actions: 'mt-4',
    followsTone: false,
  },
};

@Component({
  selector: 'app-confirm-action-dialog',
  imports: [AppIcon],
  templateUrl: './confirm-action-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmActionDialog {
  readonly copy = input.required<ConfirmActionCopy>();
  readonly isBusy = input<boolean>(false);
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  protected readonly skin = computed(() => TONE_SKINS[this.copy().tone]);

  private readonly detailSkin = computed(
    () => DETAIL_SKINS[this.copy().detailAppearance ?? 'muted'],
  );

  protected readonly questionClasses = computed(() => this.detailSkin().question);
  protected readonly actionsClasses = computed(() => this.detailSkin().actions);
  protected readonly detailClasses = computed(() => {
    const detail = this.detailSkin();
    return detail.followsTone ? `${detail.detail} ${this.skin().detailText}` : detail.detail;
  });

  @HostListener('document:keydown.escape')
  protected cancelOnEscape(): void {
    this.cancelled.emit();
  }
}
