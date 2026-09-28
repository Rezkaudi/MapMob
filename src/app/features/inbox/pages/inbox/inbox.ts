import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { EmptyPageMessage } from '../../../../shared/ui/empty-page-message/empty-page-message';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { NotificationCard } from '../../../../shared/ui/notification-card/notification-card';
import { NotificationTabs } from '../../../../shared/ui/notification-tabs/notification-tabs';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { InboxStore } from '../../state/inbox.store';

/** Cards drawn while the feed loads. */
const PLACEHOLDER_ROWS = [0, 1, 2];

@Component({
  selector: 'app-inbox',
  imports: [EmptyPageMessage, ErrorState, NotificationCard, NotificationTabs, PageHeader, Skeleton],
  templateUrl: './inbox.html',
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxPage implements OnInit {
  protected readonly store = inject(InboxStore);
  protected readonly placeholderRows = PLACEHOLDER_ROWS;

  ngOnInit(): void {
    this.store.loadNotifications();
  }
}
