import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { AppNotification } from '../../models/notification';
import {
  NotificationDetailView,
  NotificationPrimaryActionKind,
} from '../../state/notification-detail-view';
import { NotificationDialogFrame } from '../notification-dialog-frame/notification-dialog-frame';
import { NotificationStatusPill } from '../notification-status-pill/notification-status-pill';

/** The "Notification/detail notification" frames: a scheduled one and a sent one. */
@Component({
  selector: 'app-notification-detail-dialog',
  imports: [AppIcon, ErrorState, NotificationDialogFrame, NotificationStatusPill, Skeleton],
  templateUrl: './notification-detail-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationDetailDialog {
  readonly notification = input.required<AppNotification | null>();
  readonly view = input.required<NotificationDetailView | null>();
  readonly isLoading = input<boolean>(false);
  readonly error = input<string | null>(null);
  readonly isBusy = input<boolean>(false);

  readonly closed = output<void>();
  readonly retry = output<void>();
  readonly primaryAction = output<NotificationPrimaryActionKind>();
  readonly remove = output<void>();
}
