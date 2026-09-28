import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CampaignStatusPill } from '../../../../shared/ui/campaign-status-pill/campaign-status-pill';
import { RowActionsMenu } from '../../../../shared/ui/row-actions-menu/row-actions-menu';
import { TableEmpty } from '../../../../shared/ui/table-empty/table-empty';
import { TableSkeleton } from '../../../../shared/ui/table-skeleton/table-skeleton';
import { MerchantOffer } from '../../models/merchant-offer';
import { MerchantOfferRow } from '../../models/merchant-offer-row';

/**
 * Column widths as shares of the 1046px frame table (72 / 202 / 138 / 180 / 212 / 136 / 106px,
 * right to left), picked so each value sits under its header as the frame draws them.
 */
const COLUMN_WIDTHS = ['6.88%', '19.31%', '13.19%', '17.21%', '20.27%', '13%', '10.14%'];
const SKELETON_ROW_COUNT = 3;

@Component({
  selector: 'app-merchant-offer-table',
  imports: [CampaignStatusPill, RowActionsMenu, TableEmpty, TableSkeleton],
  templateUrl: './merchant-offer-table.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantOfferTable {
  readonly rows = input.required<readonly MerchantOfferRow[]>();
  readonly selectedIdSet = input<ReadonlySet<string>>(new Set());
  readonly areAllSelected = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly hasNoRows = input<boolean>(false);
  readonly emptyMessage = input<string>('');

  readonly rowToggle = output<string>();
  readonly allToggle = output<void>();
  readonly view = output<MerchantOffer>();
  readonly edit = output<MerchantOffer>();
  readonly remove = output<MerchantOffer>();

  protected readonly columnWidths = COLUMN_WIDTHS;
  protected readonly columnCount = COLUMN_WIDTHS.length;
  protected readonly skeletonRowCount = SKELETON_ROW_COUNT;
}
