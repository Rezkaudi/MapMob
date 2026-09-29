import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { StatusCopy, StatusTone } from '../../models/status-copy';

const PILL_BACKGROUNDS: Record<StatusTone, string> = {
  success: 'bg-status-success',
  warning: 'bg-accent',
  muted: 'bg-text-secondary',
};

/** The solid pill of the "سجل الاشتراكات" status column. */
@Component({
  selector: 'app-subscription-status-pill',
  template: `<span
    class="inline-flex items-center justify-center rounded-full px-3 py-1 text-[12px]/[18px] whitespace-nowrap text-white"
    [class]="background()"
    >{{ status().label }}</span
  >`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionStatusPill {
  readonly status = input.required<StatusCopy>();

  protected readonly background = computed(() => PILL_BACKGROUNDS[this.status().tone]);
}
