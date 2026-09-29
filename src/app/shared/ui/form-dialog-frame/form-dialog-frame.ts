import { ChangeDetectionStrategy, Component, HostListener, input, output } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

let nextTitleNumber = 0;

/** The white 560px "ADD PRODUCT" card: heading and cross, a scrolling body, a tinted footer. */
@Component({
  selector: 'app-form-dialog-frame',
  imports: [AppIcon],
  templateUrl: './form-dialog-frame.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormDialogFrame {
  readonly heading = input.required<string>();
  readonly subheading = input.required<string>();
  readonly closed = output<void>();

  protected readonly titleId = `form-dialog-title-${nextTitleNumber++}`;

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    this.closed.emit();
  }
}
