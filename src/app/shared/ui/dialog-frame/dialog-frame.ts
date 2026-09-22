import { ChangeDetectionStrategy, Component, HostListener, computed, input, output } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

/** `compact` is the notification frames' card; `roomy` is the wider payment one. */
export type DialogFrameAppearance = 'compact' | 'roomy';

interface DialogFrameSkin {
  readonly card: string;
  readonly header: string;
  readonly backHeader: string;
  readonly tile: string;
  readonly tileIconSize: number;
  readonly heading: string;
  readonly subheading: string;
  readonly body: string;
}

const SKINS: Record<DialogFrameAppearance, DialogFrameSkin> = {
  compact: {
    card: 'rounded-lg border-[#e6e8ea] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]',
    header: 'h-[73px] px-6',
    backHeader: 'h-[70px] px-6',
    tile: 'size-10 rounded-lg',
    tileIconSize: 20,
    heading: 'text-[18px]/[22.5px]',
    subheading: 'text-[11px]/[14px]',
    body: 'gap-4 p-6',
  },
  roomy: {
    card: 'rounded-2xl border-[rgba(192,199,213,0.3)] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]',
    header: 'h-[92px] px-8',
    backHeader: 'h-[92px] px-8',
    tile: 'size-10 rounded-lg',
    tileIconSize: 20,
    heading: 'text-[18px]/[23px]',
    subheading: 'text-[12px]/[18px]',
    body: 'gap-4 p-8',
  },
};

/** The grey-chromed card the notification and payment dialogs share: header, body, footer. */
@Component({
  selector: 'app-dialog-frame',
  imports: [AppIcon],
  templateUrl: './dialog-frame.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogFrame {
  readonly heading = input.required<string>();
  readonly subheading = input.required<string>();
  /** The glyph in the blue tile beside the heading; `null` leaves the tile out. */
  readonly headingIcon = input<string | null>(null);
  /** The reschedule frame leads with a back arrow and has no cross. */
  readonly isBackVisible = input<boolean>(false);
  readonly appearance = input<DialogFrameAppearance>('compact');
  readonly closed = output<void>();
  readonly back = output<void>();

  protected readonly skin = computed(() => SKINS[this.appearance()]);

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    this.closed.emit();
  }
}
