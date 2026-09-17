import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmActionDialog } from '../../../../shared/ui/confirm-action-dialog/confirm-action-dialog';
import { EmptyPageMessage } from '../../../../shared/ui/empty-page-message/empty-page-message';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatCard } from '../../../../shared/ui/stat-card/stat-card';
import { TablePagination } from '../../../../shared/ui/table-pagination/table-pagination';
import { Toast } from '../../../../shared/ui/toast/toast';
import { AppNotification } from '../../models/notification';
import { NotificationDetailStore } from '../../state/notification-detail.store';
import { NotificationPrimaryActionKind } from '../../state/notification-detail-view';
import { NotificationsStore } from '../../state/notifications.store';
import { NotificationDetailDialog } from '../../ui/notification-detail-dialog/notification-detail-dialog';
import { NotificationRescheduleDialog } from '../../ui/notification-reschedule-dialog/notification-reschedule-dialog';
import { NotificationResendDialog } from '../../ui/notification-resend-dialog/notification-resend-dialog';
import { buildNotificationDeleteCopy } from '../../ui/notification-dialog-copy';
import { NotificationTable } from '../../ui/notification-table/notification-table';
import { NotificationToolbar } from '../../ui/notification-toolbar/notification-toolbar';

const NOTIFICATIONS_URL = '/notifications';

@Component({
  selector: 'app-notification-list',
  imports: [
    ConfirmActionDialog,
    EmptyPageMessage,
    ErrorState,
    NotificationDetailDialog,
    NotificationRescheduleDialog,
    NotificationResendDialog,
    NotificationTable,
    NotificationToolbar,
    PageHeader,
    StatCard,
    TablePagination,
    Toast,
  ],
  templateUrl: './notification-list.html',
  providers: [NotificationDetailStore],
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationList {
  private readonly router = inject(Router);

  protected readonly store = inject(NotificationsStore);
  protected readonly detailStore = inject(NotificationDetailStore);
  /** View state only: the notification waiting for the delete to be confirmed. */
  protected readonly pendingDeletion = signal<AppNotification | null>(null);
  protected readonly deleteCopy = computed(() => {
    const notification = this.pendingDeletion();
    return notification ? buildNotificationDeleteCopy(notification) : null;
  });

  constructor() {
    this.store.loadNotifications();
    this.store.loadSummary();
  }

  protected createNotification(): void {
    this.router.navigateByUrl(`${NOTIFICATIONS_URL}/new`);
  }

  protected editNotification(notification: AppNotification): void {
    this.router.navigateByUrl(`${NOTIFICATIONS_URL}/${notification.id}/edit`);
  }

  protected runPrimaryAction(kind: NotificationPrimaryActionKind): void {
    const detail = this.detailStore.detail();
    if (!detail) {
      return;
    }
    if (kind === 'edit') {
      this.editNotification(detail);
      return;
    }
    this.detailStore.showPanel(kind);
  }

  protected reschedule(id: string, sendAt: string): void {
    this.closeDialogWhenSaved(this.store.rescheduleNotification(id, sendAt));
  }

  protected resend(id: string, sendAt: string | null): void {
    this.closeDialogWhenSaved(this.store.resendNotification(id, sendAt));
  }

  protected duplicateNotification(notification: AppNotification): void {
    this.store.duplicateNotification(notification.id);
  }

  protected async confirmDeletion(): Promise<void> {
    const notification = this.pendingDeletion();
    if (notification && (await this.store.deleteNotification(notification.id))) {
      this.pendingDeletion.set(null);
      this.detailStore.close();
    }
  }

  protected cancelDeletion(): void {
    this.pendingDeletion.set(null);
    this.store.clearSaveError();
  }

  private async closeDialogWhenSaved(save: Promise<boolean>): Promise<void> {
    if (await save) {
      this.detailStore.close();
    }
  }
}
