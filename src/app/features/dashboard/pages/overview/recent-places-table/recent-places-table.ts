import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIcon } from '../../../../../shared/ui/app-icon/app-icon';
import { Badge, BadgeTone } from '../../../../../shared/ui/badge/badge';
import { LazyImage } from '../../../../../shared/ui/lazy-image/lazy-image';
import { TableSkeleton } from '../../../../../shared/ui/table-skeleton/table-skeleton';
import { ArabicDatePipe } from '../../../../../shared/pipes/arabic-date.pipe';
import { PLACE_STATUS_LABEL, PlaceStatus, RecentPlace } from '../../../models/recent-place';

/** Six data columns plus the action column. */
const TABLE_COLUMN_COUNT = 7;

const STATUS_TONE: Record<PlaceStatus, BadgeTone> = {
  active: 'success',
  suspended: 'error',
  pending: 'warning',
};

@Component({
  selector: 'app-recent-places-table',
  imports: [AppIcon, Badge, LazyImage, TableSkeleton, ArabicDatePipe],
  templateUrl: './recent-places-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentPlacesTable {
  readonly places = input.required<readonly RecentPlace[]>();
  readonly isLoading = input<boolean>(false);

  protected readonly tableColumnCount = TABLE_COLUMN_COUNT;

  protected readonly statusLabel = PLACE_STATUS_LABEL;
  protected readonly statusTone = STATUS_TONE;
}
