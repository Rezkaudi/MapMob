import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  afterNextRender,
  input,
  output,
  viewChild,
} from '@angular/core';

let nextTitleNumber = 0;

/** The 420px panel that slides in over a dimmed page, with a fixed header and footer. */
@Component({
  selector: 'app-side-drawer',
  templateUrl: './side-drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideDrawer {
  readonly title = input.required<string>();
  readonly hasAlertDot = input<boolean>(false);
  readonly closed = output<void>();

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
