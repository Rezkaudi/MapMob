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

let nextTitleNumber = 0;

/** The offers drawer sets its actions on a grey band with more room than the reviews one. */
export type DrawerFooterTone = 'plain' | 'muted';

const FOOTER_CLASSES: Record<DrawerFooterTone, string> = {
  plain: 'border-border bg-white p-4',
  muted: 'border-[#eceef0] bg-[#f2f4f6] p-6',
};

/** The 420px panel that slides in over a dimmed page, with a fixed header and footer. */
@Component({
  selector: 'app-side-drawer',
  templateUrl: './side-drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideDrawer {
  readonly title = input.required<string>();
  readonly hasAlertDot = input<boolean>(false);
  readonly footerTone = input<DrawerFooterTone>('plain');
  readonly closed = output<void>();

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
