import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';

const STAT_CARD_COUNT = 4;

/** Holds the shape of the detail page while the user loads, so nothing jumps when it arrives. */
@Component({
  selector: 'app-user-detail-skeleton',
  imports: [Skeleton],
  templateUrl: './user-detail-skeleton.html',
  host: { class: 'block', 'aria-busy': 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailSkeleton {
  protected readonly statCards = Array.from({ length: STAT_CARD_COUNT }, (_, index) => index);
}
