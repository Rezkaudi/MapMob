import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { EmptyPageMessage } from '../../../../shared/ui/empty-page-message/empty-page-message';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { NotificationCard } from '../../../../shared/ui/notification-card/notification-card';
import { NotificationTabs } from '../../../../shared/ui/notification-tabs/notification-tabs';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { MerchantNotificationsStore } from '../../state/merchant-notifications.store';

/** Cards drawn while the feed loads. */
const PLACEHOLDER_ROWS = [0, 1, 2];

@Component({
  selector: 'app-merchant-notifications-page',
  imports: [EmptyPageMessage, ErrorState, NotificationCard, NotificationTabs, PageHeader, Skeleton],
  templateUrl: './merchant-notifications-page.html',
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantNotificationsPage implements OnInit {
  protected readonly store = inject(MerchantNotificationsStore);
  protected readonly placeholderRows = PLACEHOLDER_ROWS;

  ngOnInit(): void {
    this.store.loadNotifications();
  }
}
