import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIcon } from '../../../../../shared/ui/app-icon/app-icon';
import { Badge, BadgeTone } from '../../../../../shared/ui/badge/badge';
import { ArabicDatePipe } from '../../../../../shared/pipes/arabic-date.pipe';
import { PLACE_STATUS_LABEL, PlaceStatus, RecentPlace } from '../../../models/recent-place';

const STATUS_TONE: Record<PlaceStatus, BadgeTone> = {
  active: 'success',
  suspended: 'error',
  pending: 'warning',
};

@Component({
  selector: 'app-recent-places-table',
  imports: [AppIcon, Badge, ArabicDatePipe],
  templateUrl: './recent-places-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentPlacesTable {
  readonly places = input.required<readonly RecentPlace[]>();

  protected readonly statusLabel = PLACE_STATUS_LABEL;
  protected readonly statusTone = STATUS_TONE;
}
