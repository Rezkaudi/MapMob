import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { StatusPill } from '../../../../shared/ui/status-pill/status-pill';
import { TableSkeleton } from '../../../../shared/ui/table-skeleton/table-skeleton';
import { PaymentMethod } from '../../models/payment-method';
import {
  ACTIVATION_STATUS_LABELS,
  PAYMENT_METHOD_KIND_LABELS,
} from '../../state/payment-method-labels';

/** Column widths measured from the design, right to left. */
const COLUMN_WIDTHS = ['268px', '125px', '231px', '153px'];
const PLACEHOLDER_ROW_COUNT = 1;

@Component({
  selector: 'app-payment-method-table',
  imports: [AppIcon, StatusPill, TableSkeleton],
  templateUrl: './payment-method-table.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMethodTable {
  readonly methods = input.required<readonly PaymentMethod[]>();
  readonly isLoading = input<boolean>(false);
  readonly edit = output<PaymentMethod>();

  protected readonly columnWidths = COLUMN_WIDTHS;
  protected readonly placeholderRowCount = PLACEHOLDER_ROW_COUNT;
  protected readonly kindLabels = PAYMENT_METHOD_KIND_LABELS;
  protected readonly statusLabels = ACTIVATION_STATUS_LABELS;
}
