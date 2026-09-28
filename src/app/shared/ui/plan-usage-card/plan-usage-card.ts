import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlanQuota, PlanQuotaTone } from '../../models/plan-quota';
import { AppIcon } from '../app-icon/app-icon';

const SUBSCRIPTION_ROUTE = '/merchant/subscription';

const CHIP_BACKGROUNDS: Record<PlanQuotaTone, string> = {
  success: 'bg-status-success',
  error: 'bg-error',
};

/** The merchant's "… المستخدمة" card: how much of one plan limit is used, and an upgrade link. */
@Component({
  selector: 'app-plan-usage-card',
  imports: [AppIcon, RouterLink],
  templateUrl: './plan-usage-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanUsageCard {
  readonly title = input.required<string>();
  readonly planName = input.required<string>();
  readonly quota = input.required<PlanQuota>();

  protected readonly subscriptionRoute = SUBSCRIPTION_ROUTE;
  protected readonly chipBackground = computed(
    () => CHIP_BACKGROUNDS[this.quota().remainingChipTone],
  );
  protected readonly barLabel = computed(() => `${this.title()} من الباقة`);
}
