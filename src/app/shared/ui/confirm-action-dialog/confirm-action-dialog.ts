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
  /** A boxed detail takes the width of the card, or of the context card above it. */
  readonly isBoxed: boolean;
}

/** The story frame sets its context card and warning 4px in, and its icon 4px closer to the title. */
const FULL_BOX_WIDTH = 'w-full';
const CONTEXT_BOX_WIDTH = 'w-[calc(100%-8px)]';
const ICON_SPACING = 'pb-4';
const CONTEXT_ICON_SPACING = 'pb-3';

const DETAIL_SKINS: Record<ConfirmDetailAppearance, DetailSkin> = {
  muted: {
    question: 'pb-1',
    detail: 'pb-1 text-[16px]/[24px] text-text-secondary',
    actions: 'mt-[53px]',
    followsTone: false,
    isBoxed: false,
  },
  toned: {
    question: 'pb-1',
    detail: 'pb-8 text-[14px]/[21px]',
    actions: '',
    followsTone: true,
    isBoxed: false,
  },
  callout: {
    question: 'mt-2 pb-1',
    detail:
      'mt-1 flex h-[47px] items-center justify-start rounded border border-[#fecaca] bg-[rgba(254,242,242,0.7)] px-4 text-start text-[14px]/[20px] font-bold text-status-error',
    actions: 'mt-4',
    followsTone: false,
    isBoxed: true,
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
  protected readonly boxWidth = computed(() =>
    this.copy().context ? CONTEXT_BOX_WIDTH : FULL_BOX_WIDTH,
  );
  protected readonly iconSpacing = computed(() =>
    this.copy().context ? CONTEXT_ICON_SPACING : ICON_SPACING,
  );
  protected readonly detailClasses = computed(() => {
    const detail = this.detailSkin();
    const tone = detail.followsTone ? ` ${this.skin().detailText}` : '';
    const width = detail.isBoxed ? ` ${this.boxWidth()}` : '';
    return `${detail.detail}${tone}${width}`;
  });

  @HostListener('document:keydown.escape')
  protected cancelOnEscape(): void {
    this.cancelled.emit();
  }
}
