import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SUBSCRIPTION_STATUS_LABEL } from '../../models/subscription-status-label';
import { SubscriptionStatus } from '../../models/subscription-status';

const STATUS_BACKGROUND: Record<SubscriptionStatus, string> = {
  active: 'bg-status-success',
  paused: 'bg-text-secondary',
  expired: 'bg-status-error',
};

@Component({
  selector: 'app-subscription-status-pill',
  template: `<span
    class="inline-flex items-center justify-center rounded-full px-3 py-1 text-[12px]/[18px] whitespace-nowrap text-white"
    [class]="background()"
    >{{ label() }}</span
  >`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionStatusPill {
  readonly status = input.required<SubscriptionStatus>();

  protected readonly label = computed(() => SUBSCRIPTION_STATUS_LABEL[this.status()]);
  protected readonly background = computed(() => STATUS_BACKGROUND[this.status()]);
}
