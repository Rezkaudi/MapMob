import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';

const TAB_COUNT = 3;
const MEDIA_CARD_COUNT = 4;

function countTo(total: number): readonly number[] {
  return Array.from({ length: total }, (_unused, index) => index);
}

/** Grey blocks shaped like the media page while the gallery loads. */
@Component({
  selector: 'app-merchant-media-skeleton',
  imports: [Skeleton],
  templateUrl: './merchant-media-skeleton.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantMediaSkeleton {
  protected readonly tabs = countTo(TAB_COUNT);
  protected readonly mediaCards = countTo(MEDIA_CARD_COUNT);
}
