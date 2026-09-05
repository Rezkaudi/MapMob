import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Skeleton } from '../../../../../shared/ui/skeleton/skeleton';

const HEADER_ACTIONS = [0, 1, 2];
const SIDE_CARDS = [0, 1, 2, 3];

/** The shape of the place page, drawn in grey while the place is being fetched. */
@Component({
  selector: 'app-place-detail-skeleton',
  imports: [Skeleton],
  templateUrl: './place-detail-skeleton.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceDetailSkeleton {
  protected readonly headerActions = HEADER_ACTIONS;
  protected readonly sideCards = SIDE_CARDS;
}
