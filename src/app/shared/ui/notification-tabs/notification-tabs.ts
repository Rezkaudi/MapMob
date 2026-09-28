import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import {
  NOTIFICATION_TABS,
  NOTIFICATION_TAB_LABELS,
  NotificationTab,
} from '../../models/notification-tab';

const ACTIVE_CLASSES = 'border-primary font-bold text-primary';
const IDLE_CLASSES = 'border-transparent font-medium text-text-secondary';

@Component({
  selector: 'app-notification-tabs',
  templateUrl: './notification-tabs.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTabs {
  readonly selected = input.required<NotificationTab>();
  readonly unreadCount = input.required<number>();
  readonly selectTab = output<NotificationTab>();

  protected readonly tabs = computed(() =>
    NOTIFICATION_TABS.map((value) => ({ value, label: this.labelFor(value) })),
  );

  protected readonly activeClasses = ACTIVE_CLASSES;
  protected readonly idleClasses = IDLE_CLASSES;

  /** Only غير مقروءة carries a number, the way the design writes it. */
  private labelFor(tab: NotificationTab): string {
    const label = NOTIFICATION_TAB_LABELS[tab];
    return tab === 'unread' ? `${label} (${this.unreadCount()})` : label;
  }
}
