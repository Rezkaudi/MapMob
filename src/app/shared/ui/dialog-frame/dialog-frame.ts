import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  input,
  output,
} from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

/**
 * `compact` is the notification frames' card; `roomy` is the wider payment one;
 * `slim` is the merchant subscription one, with a 65px bar and a borderless footer;
 * `light` is the store QR one: 448px wide, a white header and a pale footer.
 */
export type DialogFrameAppearance = 'compact' | 'roomy' | 'slim' | 'light';

interface DialogFrameSkin {
  readonly card: string;
  readonly header: string;
  readonly backHeader: string;
  readonly tile: string;
  readonly tileIconSize: number;
  readonly heading: string;
  readonly subheading: string;
  readonly body: string;
  readonly footer: string;
}

const GREY_CARD_WIDTH = 'max-w-[576px]';
const GREY_BAR = 'border-[#e6e8ea] bg-[#f2f4f6]';
const BORDERED_FOOTER = `min-h-[79px] gap-4 border-t p-4 ${GREY_BAR}`;

const SKINS: Record<DialogFrameAppearance, DialogFrameSkin> = {
  compact: {
    card: `${GREY_CARD_WIDTH} rounded-lg border-[#e6e8ea] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]`,
    header: `h-[73px] items-center px-6 ${GREY_BAR}`,
    backHeader: `h-[70px] items-center px-6 ${GREY_BAR}`,
    tile: 'size-10 rounded-lg',
    tileIconSize: 20,
    heading: 'text-[18px]/[22.5px]',
    subheading: 'text-[11px]/[14px]',
    body: 'gap-4 p-6',
    footer: BORDERED_FOOTER,
  },
  roomy: {
    card: `${GREY_CARD_WIDTH} rounded-2xl border-[rgba(192,199,213,0.3)] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]`,
    header: `h-[92px] items-center px-8 ${GREY_BAR}`,
    backHeader: `h-[92px] items-center px-8 ${GREY_BAR}`,
    tile: 'size-10 rounded-lg',
    tileIconSize: 20,
    heading: 'text-[18px]/[23px]',
    subheading: 'text-[12px]/[18px]',
    body: 'gap-4 p-8',
    footer: BORDERED_FOOTER,
  },
  slim: {
    card: `${GREY_CARD_WIDTH} rounded-lg border-[#e6e8ea] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]`,
    // The cross stays on the top line when a long line under the heading wraps.
    header: `min-h-[65px] items-start px-6 py-4 ${GREY_BAR}`,
    backHeader: `min-h-[65px] items-start px-6 py-4 ${GREY_BAR}`,
    tile: 'size-10 rounded-lg',
    tileIconSize: 20,
    heading: 'text-[18px]/[22.5px]',
    subheading: 'max-w-[443px] text-[12px]/[22.5px]',
    body: 'gap-4 p-6',
    footer: `min-h-[76px] gap-3 px-6 py-4 ${GREY_BAR}`,
  },
  light: {
    card: 'max-w-md rounded-2xl border-border shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]',
    header: 'items-start border-surface-muted bg-white px-6 py-4',
    backHeader: 'items-start border-surface-muted bg-white px-6 py-4',
    tile: 'size-10 rounded-lg',
    tileIconSize: 20,
    heading: 'text-[18px]/[22px]',
    subheading: 'mt-1 text-[12px]/[16px]',
    body: 'gap-4 px-6 pt-6 pb-5',
    footer: 'gap-2 border-t border-surface-muted bg-surface-muted px-6 py-4',
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
  /** `null` leaves the line under the heading out. */
  readonly subheading = input<string | null>(null);
  /** The glyph in the blue tile beside the heading; `null` leaves the tile out. */
  readonly headingIcon = input<string | null>(null);
  /** The reschedule frame leads with a back arrow and has no cross. */
  readonly isBackVisible = input<boolean>(false);
  readonly appearance = input<DialogFrameAppearance>('compact');
  /** A read-only dialog, such as the subscription details, has no footer bar. */
  readonly hasFooter = input<boolean>(true);
  readonly closed = output<void>();
  readonly back = output<void>();

  protected readonly skin = computed(() => SKINS[this.appearance()]);

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    this.closed.emit();
  }
}
