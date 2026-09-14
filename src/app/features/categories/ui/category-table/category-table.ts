import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { RowActionsMenu } from '../../../../shared/ui/row-actions-menu/row-actions-menu';
import { StatusPill } from '../../../../shared/ui/status-pill/status-pill';
import { TableEmpty } from '../../../../shared/ui/table-empty/table-empty';
import { TableSkeleton } from '../../../../shared/ui/table-skeleton/table-skeleton';
import { Category } from '../../models/category';
import { categoryIconAssetName } from '../../models/category-icon';
import { CATEGORY_KIND_LABEL } from '../../models/category-kind';
import { CATEGORY_STATUS_LABEL } from '../../models/category-status';

/**
 * Column widths as shares of the 1046px design table (80 / 170 / 165 / 140 / 175 / 145 / 171px),
 * so wider screens spread the columns instead of piling the spare room into one.
 */
const COLUMN_WIDTHS = ['7.65%', '16.25%', '15.77%', '13.38%', '16.73%', '13.86%', '16.36%'];
const DEFAULT_ROW_COUNT = 5;
/** The design draws a dash when a category has no parent. */
const NO_PARENT_LABEL = '_';

interface CategoryTableRow {
  readonly category: Category;
  readonly iconAssetName: string;
  readonly kindLabel: string;
  readonly parentLabel: string;
  readonly statusLabel: string;
}

@Component({
  selector: 'app-category-table',
  imports: [AppIcon, RowActionsMenu, StatusPill, TableEmpty, TableSkeleton],
  templateUrl: './category-table.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryTable {
  readonly entries = input.required<readonly Category[]>();
  readonly selectedIdSet = input<ReadonlySet<string>>(new Set());
  readonly areAllSelected = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly hasNoResults = input<boolean>(false);
  readonly emptyMessage = input<string>('');
  readonly rowCount = input<number>(DEFAULT_ROW_COUNT);

  readonly rowToggle = output<string>();
  readonly allToggle = output<void>();
  readonly edit = output<Category>();
  readonly statusChange = output<Category>();
  readonly remove = output<Category>();

  protected readonly columnWidths = COLUMN_WIDTHS;
  protected readonly columnCount = COLUMN_WIDTHS.length;
  protected readonly rows = computed<readonly CategoryTableRow[]>(() =>
    this.entries().map((category) => ({
      category,
      iconAssetName: categoryIconAssetName(category.icon),
      kindLabel: CATEGORY_KIND_LABEL[category.kind],
      parentLabel: category.parentName ?? NO_PARENT_LABEL,
      statusLabel: CATEGORY_STATUS_LABEL[category.status],
    })),
  );
}
