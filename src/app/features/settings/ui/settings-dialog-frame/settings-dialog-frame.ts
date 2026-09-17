import { ChangeDetectionStrategy, Component, HostListener, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

let nextFrameNumber = 0;

/**
 * The 580px settings dialog: icon badge, title and cross on top, the fields in between,
 * the main action and cancel at the foot. Wrap it in the dialog's `<form>` so the main
 * button submits it.
 */
@Component({
  selector: 'app-settings-dialog-frame',
  imports: [AppIcon],
  templateUrl: './settings-dialog-frame.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsDialogFrame {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly icon = input.required<string>();
  readonly submitLabel = input.required<string>();
  readonly isBusy = input<boolean>(false);
  readonly saveError = input<string | null>(null);
  readonly closed = output<void>();

  protected readonly titleId = `settings-dialog-title-${nextFrameNumber++}`;

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    this.closed.emit();
  }
}
