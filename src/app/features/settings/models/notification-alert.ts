import { NotificationAlertKind } from './notification-alert-kind';

/** One dashboard alert the admin can switch on or off. */
export interface NotificationAlert {
  readonly kind: NotificationAlertKind;
  readonly isEnabled: boolean;
}
