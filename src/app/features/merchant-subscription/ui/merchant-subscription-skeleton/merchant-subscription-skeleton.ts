import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';

const USAGE_CARD_COUNT = 4;
const PLAN_CARD_COUNT = 3;

function countTo(total: number): readonly number[] {
  return Array.from({ length: total }, (_unused, index) => index);
}

/** Grey blocks shaped like the subscription page while its data loads. */
@Component({
  selector: 'app-merchant-subscription-skeleton',
  imports: [Skeleton],
  templateUrl: './merchant-subscription-skeleton.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantSubscriptionSkeleton {
  protected readonly usageCards = countTo(USAGE_CARD_COUNT);
  protected readonly planCards = countTo(PLAN_CARD_COUNT);
}
