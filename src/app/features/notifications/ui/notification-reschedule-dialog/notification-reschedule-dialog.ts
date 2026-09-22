import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { CLOCK } from '../../../../core/config/clock';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { AppNotification } from '../../models/notification';
import { NotificationDetailView } from '../../state/notification-detail-view';
import { SendMoment, joinSendAt, splitSendAt } from '../../state/send-moment';
import { toWallClockTime } from '../../state/wall-clock-time';
import { DialogFrame } from '../../../../shared/ui/dialog-frame/dialog-frame';
import { SendMomentField } from '../send-moment-field/send-moment-field';

const EMPTY_MOMENT: SendMoment = { day: '', time: '' };

/** The "إعادة جدولة الاشعار" frame, opened from a scheduled notification's details. */
@Component({
  selector: 'app-notification-reschedule-dialog',
  imports: [AppIcon, DialogFrame, SendMomentField],
  templateUrl: './notification-reschedule-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationRescheduleDialog {
  private readonly clock = inject(CLOCK);

  readonly notification = input.required<AppNotification>();
  readonly view = input.required<NotificationDetailView>();
  readonly isBusy = input<boolean>(false);

  readonly confirmed = output<string>();
  readonly back = output<void>();
  readonly closed = output<void>();

  protected readonly moment = linkedSignal(() => {
    const sendAt = this.notification().sendAt;
    return sendAt ? splitSendAt(sendAt) : EMPTY_MOMENT;
  });
  protected readonly canConfirm = computed(() => {
    const { day, time } = this.moment();
    if (!day || !time) {
      return false;
    }
    const sendAt = joinSendAt({ day, time });
    return sendAt !== this.notification().sendAt && sendAt > toWallClockTime(this.clock());
  });

  protected changeDay(day: string | null): void {
    this.moment.update((moment) => ({ ...moment, day: day ?? '' }));
  }

  protected changeTime(time: string | null): void {
    this.moment.update((moment) => ({ ...moment, time: time ?? '' }));
  }

  protected confirm(): void {
    if (this.canConfirm()) {
      this.confirmed.emit(joinSendAt(this.moment()));
    }
  }
}
