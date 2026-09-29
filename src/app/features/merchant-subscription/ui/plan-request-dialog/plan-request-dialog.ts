import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { DialogFrame } from '../../../../shared/ui/dialog-frame/dialog-frame';
import { PlanRequestView } from '../../models/plan-request-view';
import { RequestDialogButtons } from '../request-dialog-buttons/request-dialog-buttons';

/** "طلب ترقية الباقة" and "طلب تجديد الاشتراك": a summary, the review notice, then send. */
@Component({
  selector: 'app-plan-request-dialog',
  imports: [AppIcon, DialogFrame, RequestDialogButtons],
  templateUrl: './plan-request-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanRequestDialog {
  readonly request = input.required<PlanRequestView>();
  readonly isBusy = input<boolean>(false);
  readonly submitted = output<void>();
  readonly closed = output<void>();
}
