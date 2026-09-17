import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { OptionCard } from '../../../../shared/ui/option-card/option-card';
import { RadioDot } from '../../../../shared/ui/radio-dot/radio-dot';
import { SendTiming } from '../../models/send-timing';
import { SendMomentField } from '../send-moment-field/send-moment-field';

const PICKED_LATER_CARD = 'border-2 border-primary bg-[rgba(239,246,255,0.4)] px-[11px] py-3';
const IDLE_LATER_CARD = 'border border-text-secondary bg-white px-3 py-[13px]';

/** "موعد الإرسال وخطة الجدولة": send now, or a later card that carries its own date and time. */
@Component({
  selector: 'app-notification-send-timing',
  imports: [OptionCard, RadioDot, SendMomentField],
  templateUrl: './notification-send-timing.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationSendTiming {
  readonly timing = input.required<SendTiming>();
  readonly sendDay = input.required<string | null>();
  readonly sendTime = input.required<string | null>();
  readonly error = input<string | null>(null);
  readonly timingChange = output<SendTiming>();
  readonly sendDayChange = output<string | null>();
  readonly sendTimeChange = output<string | null>();

  protected readonly isLater = computed(() => this.timing() === 'later');
  protected readonly laterCardClasses = computed(() =>
    this.isLater() ? PICKED_LATER_CARD : IDLE_LATER_CARD,
  );

  protected changeDay(day: string | null): void {
    this.timingChange.emit('later');
    this.sendDayChange.emit(day);
  }

  protected changeTime(time: string | null): void {
    this.timingChange.emit('later');
    this.sendTimeChange.emit(time);
  }
}
