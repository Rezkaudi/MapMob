import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CLOCK } from '../../../core/config/clock';
import { formatArabicRelativeTime } from '../../formatting/arabic-relative-time';
import { NotificationCardView } from '../../models/notification-card-view';
import { NotificationEdgeTone } from '../../models/notification-edge-tone';
import { AppIcon } from '../app-icon/app-icon';

const EDGE_CLASSES: Record<NotificationEdgeTone, string> = {
  amber: 'border-[#fbbf24]',
  green: 'border-status-success',
  primary: 'border-primary',
  muted: 'border-text-secondary',
};

/** One card of a notification feed: the admin inbox and the merchant notifications page. */
@Component({
  selector: 'app-notification-card',
  imports: [AppIcon, RouterLink],
  templateUrl: './notification-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationCard {
  readonly notification = input.required<NotificationCardView>();
  readonly markRead = output<void>();

  private readonly clock = inject(CLOCK);

  protected readonly edgeClasses = computed(() => EDGE_CLASSES[this.notification().edgeTone]);
  protected readonly time = computed(() =>
    formatArabicRelativeTime(this.notification().receivedAt, this.clock()),
  );

  protected followAction(): void {
    if (!this.notification().isRead) {
      this.markRead.emit();
    }
  }
}
