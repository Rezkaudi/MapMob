import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';

const STORY_CARD_COUNT = 2;

/** Grey blocks shaped like the stories page while it loads. */
@Component({
  selector: 'app-merchant-stories-skeleton',
  imports: [Skeleton],
  templateUrl: './merchant-stories-skeleton.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantStoriesSkeleton {
  protected readonly storyCards = Array.from(
    { length: STORY_CARD_COUNT },
    (_unused, index) => index,
  );
}
