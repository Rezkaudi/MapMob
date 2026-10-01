import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  afterNextRender,
  computed,
  input,
  output,
  viewChild,
} from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

let nextTitleNumber = 0;

/** The offers drawer sets its actions on a grey band; the story drawer insets its rule by 20px. */
export type DrawerFooterTone = 'plain' | 'muted' | 'inset';

const FOOTER_CLASSES: Record<DrawerFooterTone, string> = {
  plain: 'border-border bg-white p-4',
  muted: 'border-[#eceef0] bg-[#f2f4f6] p-6',
  inset: 'mx-5 border-border bg-white p-4',
};

/** `panel` is the 420px drawer with a grey header; `plain` the 460px all-white one of the story frame. */
export type DrawerAppearance = 'panel' | 'plain';

interface DrawerSkin {
  readonly panel: string;
  readonly header: string;
  readonly title: string;
  readonly closeButton: string;
  /** The plain drawer draws its cross as an icon, 8px in from the button's corner. */
  readonly hasCloseIcon: boolean;
}

const SKINS: Record<DrawerAppearance, DrawerSkin> = {
  panel: {
    panel: 'w-[420px] border-r border-border',
    header: 'border-b border-border bg-surface-muted/70 p-5',
    title: 'text-[16px]/[24px] text-[#1e293b]',
    closeButton:
      'size-8 items-center rounded-lg text-[14px]/[20px] text-[#94a3b8] hover:bg-surface-muted hover:text-text-secondary',
    hasCloseIcon: false,
  },
  plain: {
    panel: 'w-[460px]',
    header: 'px-6 py-4',
    title: 'text-[14px]/[20px] text-text-primary',
    closeButton: 'h-9 w-7 items-start rounded pt-2 text-[#1e293b] hover:bg-surface-muted',
    hasCloseIcon: true,
  },
};

/** The panel that slides in over a dimmed page, with a fixed header and footer. */
@Component({
  selector: 'app-side-drawer',
  imports: [AppIcon],
  templateUrl: './side-drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideDrawer {
  readonly title = input.required<string>();
  readonly hasAlertDot = input<boolean>(false);
  readonly footerTone = input<DrawerFooterTone>('plain');
  readonly appearance = input<DrawerAppearance>('panel');
  readonly closed = output<void>();

  protected readonly skin = computed(() => SKINS[this.appearance()]);
  protected readonly footerClasses = computed(() => FOOTER_CLASSES[this.footerTone()]);
  protected readonly titleId = `side-drawer-title-${nextTitleNumber++}`;
  private readonly closeButton = viewChild.required<ElementRef<HTMLButtonElement>>('closeButton');

  constructor() {
    afterNextRender(() => this.closeButton().nativeElement.focus());
  }

  @HostListener('document:keydown.escape')
  protected close(): void {
    this.closed.emit();
  }
}
