import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RowActionsMenu } from '../../../../shared/ui/row-actions-menu/row-actions-menu';
import { StatusPill } from '../../../../shared/ui/status-pill/status-pill';
import { TableEmpty } from '../../../../shared/ui/table-empty/table-empty';
import { TableSkeleton } from '../../../../shared/ui/table-skeleton/table-skeleton';
import { MerchantProduct } from '../../models/merchant-product';
import { ProductTableRow } from '../../models/product-table-row';

/**
 * Column widths as shares of the 1046px frame table (72 / 122 / 191 / 150 / 254 / 144 / 113px,
 * right to left), so wider screens spread the columns evenly.
 */
const COLUMN_WIDTHS = ['6.88%', '11.66%', '18.26%', '14.34%', '24.28%', '13.77%', '10.81%'];
const SKELETON_ROW_COUNT = 3;

@Component({
  selector: 'app-product-table',
  imports: [RowActionsMenu, StatusPill, TableEmpty, TableSkeleton],
  templateUrl: './product-table.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTable {
  readonly rows = input.required<readonly ProductTableRow[]>();
  readonly selectedIdSet = input<ReadonlySet<string>>(new Set());
  readonly areAllSelected = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly hasNoRows = input<boolean>(false);
  readonly emptyMessage = input<string>('');

  readonly rowToggle = output<string>();
  readonly allToggle = output<void>();
  readonly edit = output<MerchantProduct>();
  readonly remove = output<MerchantProduct>();

  protected readonly columnWidths = COLUMN_WIDTHS;
  protected readonly columnCount = COLUMN_WIDTHS.length;
  protected readonly skeletonRowCount = SKELETON_ROW_COUNT;
}
