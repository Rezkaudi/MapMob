import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LatinDigitDatePipe } from '../../../../shared/pipes/latin-digit-date.pipe';
import { StatusPill } from '../../../../shared/ui/status-pill/status-pill';
import { TableSkeleton } from '../../../../shared/ui/table-skeleton/table-skeleton';
import { DashboardAdmin } from '../../models/dashboard-admin';
import { ACTIVATION_STATUS_LABELS } from '../../state/payment-method-labels';

/** Column widths measured from the design, right to left. */
const COLUMN_WIDTHS = ['144px', '201px', '110px', '155px', '167px'];
const PLACEHOLDER_ROW_COUNT = 4;

@Component({
  selector: 'app-admin-table',
  imports: [LatinDigitDatePipe, StatusPill, TableSkeleton],
  templateUrl: './admin-table.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTable {
  readonly admins = input.required<readonly DashboardAdmin[]>();
  readonly isLoading = input<boolean>(false);

  protected readonly columnWidths = COLUMN_WIDTHS;
  protected readonly placeholderRowCount = PLACEHOLDER_ROW_COUNT;
  protected readonly statusLabels = ACTIVATION_STATUS_LABELS;
}
