import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { DialogFrame } from '../../../../shared/ui/dialog-frame/dialog-frame';
import { PlanDowngradeView } from '../../models/plan-downgrade-view';
import { PlanLimitsColumn } from '../plan-limits-column/plan-limits-column';
import { RequestDialogButtons } from '../request-dialog-buttons/request-dialog-buttons';

/** "الانتقال إلى …": the two plans side by side, a warning, then confirm. */
@Component({
  selector: 'app-plan-downgrade-dialog',
  imports: [AppIcon, DialogFrame, PlanLimitsColumn, RequestDialogButtons],
  templateUrl: './plan-downgrade-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanDowngradeDialog {
  readonly downgrade = input.required<PlanDowngradeView>();
  readonly isBusy = input<boolean>(false);
  readonly submitted = output<void>();
  readonly closed = output<void>();
}
