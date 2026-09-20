import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { CLOCK } from '../../../../core/config/clock';
import { formatArabicRelativeTime } from '../../../../shared/formatting/arabic-relative-time';
import { INBOX_CATEGORY_LABELS, InboxCategory } from '../../models/inbox-category';
import { InboxNotification } from '../../models/inbox-notification';

/** The design colours البلاغات amber and الاشتراكات green; the other two take theme colours. */
const EDGE_COLOURS: Record<InboxCategory, string> = {
  complaints: 'border-[#fbbf24]',
  subscriptions: 'border-status-success',
  offers: 'border-primary',
  system: 'border-text-secondary',
};

@Component({
  selector: 'app-inbox-notification-card',
  templateUrl: './inbox-notification-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxNotificationCard {
  readonly notification = input.required<InboxNotification>();
  readonly markRead = output<void>();

  private readonly clock = inject(CLOCK);

  protected readonly categoryLabel = computed(
    () => INBOX_CATEGORY_LABELS[this.notification().category],
  );
  protected readonly edgeColour = computed(() => EDGE_COLOURS[this.notification().category]);
  protected readonly time = computed(() =>
    formatArabicRelativeTime(this.notification().receivedAt, this.clock()),
  );
}
