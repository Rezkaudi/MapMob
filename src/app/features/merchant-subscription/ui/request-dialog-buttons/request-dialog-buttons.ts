import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** "إلغاء" and the send button, as the plan-change frames draw their footer. */
@Component({
  selector: 'app-request-dialog-buttons',
  templateUrl: './request-dialog-buttons.html',
  // `contents` lets the two buttons sit straight in the dialog footer's flex row.
  host: { class: 'contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestDialogButtons {
  readonly confirmLabel = input.required<string>();
  readonly isBusy = input<boolean>(false);
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
