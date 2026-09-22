import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CLOCK } from '../../../../core/config/clock';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { OptionCard } from '../../../../shared/ui/option-card/option-card';
import { AppNotification } from '../../models/notification';
import { SendTiming } from '../../models/send-timing';
import { NotificationDetailView } from '../../state/notification-detail-view';
import { joinSendAt } from '../../state/send-moment';
import { suggestSendMoment } from '../../state/suggest-send-moment';
import { toWallClockTime } from '../../state/wall-clock-time';
import { DialogFrame } from '../../../../shared/ui/dialog-frame/dialog-frame';
import { SendMomentField } from '../send-moment-field/send-moment-field';

interface TimingChoice {
  readonly timing: SendTiming;
  readonly title: string;
  readonly description: string;
}

/** RTL puts the first card on the right, as the frame does. */
const TIMING_CHOICES: readonly TimingChoice[] = [
  {
    timing: 'now',
    title: 'إرسال فوري الآن',
    description: 'سيتم الإرسال في غضون دقيقة واحدة من تأكيد الضغط.',
  },
  {
    timing: 'later',
    title: 'جدولة الإرسال',
    description: 'تحديد وقت وتاريخ مستقبلي لإرسال الإشعار',
  },
];

/** The "RESEND NOTIFICATION" frame, opened from a sent notification's details. */
@Component({
  selector: 'app-notification-resend-dialog',
  imports: [AppIcon, DialogFrame, OptionCard, SendMomentField],
  templateUrl: './notification-resend-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationResendDialog {
  private readonly clock = inject(CLOCK);

  readonly notification = input.required<AppNotification>();
  readonly view = input.required<NotificationDetailView>();
  readonly isBusy = input<boolean>(false);

  /** `null` resends straight away. */
  readonly confirmed = output<string | null>();
  readonly remove = output<void>();
  readonly closed = output<void>();

  protected readonly timingChoices = TIMING_CHOICES;
  /** The frame opens on a scheduled resend. */
  protected readonly timing = signal<SendTiming>('later');
  protected readonly moment = signal(suggestSendMoment(this.clock()));
  protected readonly canConfirm = computed(() => {
    if (this.timing() === 'now') {
      return true;
    }
    const { day, time } = this.moment();
    return Boolean(day && time) && joinSendAt({ day, time }) > toWallClockTime(this.clock());
  });

  protected changeDay(day: string | null): void {
    this.moment.update((moment) => ({ ...moment, day: day ?? '' }));
  }

  protected changeTime(time: string | null): void {
    this.moment.update((moment) => ({ ...moment, time: time ?? '' }));
  }

  protected confirm(): void {
    if (!this.canConfirm()) {
      return;
    }
    this.confirmed.emit(this.timing() === 'now' ? null : joinSendAt(this.moment()));
  }
}
