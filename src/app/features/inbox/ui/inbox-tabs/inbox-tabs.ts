import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { INBOX_TABS, INBOX_TAB_LABELS, InboxTab } from '../../models/inbox-tab';

const ACTIVE_CLASSES = 'border-primary font-bold text-primary';
const IDLE_CLASSES = 'border-transparent font-medium text-text-secondary';

@Component({
  selector: 'app-inbox-tabs',
  templateUrl: './inbox-tabs.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxTabs {
  readonly selected = input.required<InboxTab>();
  readonly unreadCount = input.required<number>();
  readonly selectTab = output<InboxTab>();

  protected readonly tabs = computed(() =>
    INBOX_TABS.map((value) => ({ value, label: this.labelFor(value) })),
  );

  protected readonly activeClasses = ACTIVE_CLASSES;
  protected readonly idleClasses = IDLE_CLASSES;

  /** Only غير مقروءة carries a number, the way the design writes it. */
  private labelFor(tab: InboxTab): string {
    const label = INBOX_TAB_LABELS[tab];
    return tab === 'unread' ? `${label} (${this.unreadCount()})` : label;
  }
}
