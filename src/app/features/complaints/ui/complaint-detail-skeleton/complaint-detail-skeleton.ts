import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';

/** Grey blocks in the shape of the four detail cards while the complaint loads. */
@Component({
  selector: 'app-complaint-detail-skeleton',
  imports: [Skeleton],
  templateUrl: './complaint-detail-skeleton.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplaintDetailSkeleton {}
