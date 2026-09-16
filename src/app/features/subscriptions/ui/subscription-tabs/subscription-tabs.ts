import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { SubscriptionTab } from '../../models/subscription-tab';

interface TabView {
  readonly id: SubscriptionTab;
  readonly label: string;
  readonly icon: string;
  readonly count: string;
}

const THOUSANDS_LOCALE = 'en-US';

@Component({
  selector: 'app-subscription-tabs',
  imports: [AppIcon],
  templateUrl: './subscription-tabs.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionTabs {
  readonly selected = input.required<SubscriptionTab>();
  readonly packageCount = input.required<number>();
  readonly recordCount = input.required<number>();
  readonly selectedChange = output<SubscriptionTab>();

  protected readonly tabs = computed<readonly TabView[]>(() => [
    {
      id: 'packages',
      label: 'باقات الاشتراك',
      icon: 'grid-four',
      count: this.format(this.packageCount()),
    },
    {
      id: 'records',
      label: 'سجل الاشتراكات',
      icon: 'users-group',
      count: this.format(this.recordCount()),
    },
  ]);

  private format(count: number): string {
    return count.toLocaleString(THOUSANDS_LOCALE);
  }
}
