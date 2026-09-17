import { ChangeDetectionStrategy, Component, HostListener, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

/** The 576px card the details, resend and reschedule frames share: grey header, body, grey footer. */
@Component({
  selector: 'app-notification-dialog-frame',
  imports: [AppIcon],
  templateUrl: './notification-dialog-frame.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationDialogFrame {
  readonly heading = input.required<string>();
  readonly subheading = input.required<string>();
  /** The glyph in the blue tile beside the heading; `null` leaves the tile out. */
  readonly headingIcon = input<string | null>(null);
  /** The reschedule frame leads with a back arrow and has no cross. */
  readonly isBackVisible = input<boolean>(false);
  readonly closed = output<void>();
  readonly back = output<void>();

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    this.closed.emit();
  }
}
