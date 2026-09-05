import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

export type ConfirmTone = 'primary' | 'danger';

@Component({
  selector: 'app-confirm-dialog',
  imports: [AppIcon],
  templateUrl: './confirm-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly note = input<string>('');
  readonly confirmLabel = input.required<string>();
  readonly tone = input<ConfirmTone>('primary');
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
