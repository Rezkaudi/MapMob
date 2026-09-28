import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ProductQuota, ProductQuotaTone } from '../../models/product-quota';

const SUBSCRIPTION_ROUTE = '/merchant/subscription';

const CHIP_BACKGROUNDS: Record<ProductQuotaTone, string> = {
  success: 'bg-status-success',
  error: 'bg-error',
};

@Component({
  selector: 'app-product-usage-card',
  imports: [AppIcon, RouterLink],
  templateUrl: './product-usage-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductUsageCard {
  readonly planName = input.required<string>();
  readonly quota = input.required<ProductQuota>();

  protected readonly subscriptionRoute = SUBSCRIPTION_ROUTE;
  protected readonly chipBackground = computed(
    () => CHIP_BACKGROUNDS[this.quota().remainingChipTone],
  );
}
