import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { formatMonthFirstDate } from '../../../../shared/formatting/month-first-date';
import { formatTwelveHourTime } from '../../../../shared/formatting/twelve-hour-time';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

export type SendMomentKind = 'date' | 'time';

/** `outlined` is the 44px white box of the create page and resend frame; `filled` the reschedule one. */
export type SendMomentAppearance = 'outlined' | 'filled';

interface KindSkin {
  readonly icon: string;
  readonly iconSize: number;
  readonly placeholder: string;
  readonly format: (value: string) => string;
}

const KIND_SKINS: Record<SendMomentKind, KindSkin> = {
  date: {
    icon: 'calendar-filled',
    iconSize: 15,
    placeholder: 'اختر التاريخ',
    format: formatMonthFirstDate,
  },
  time: {
    icon: 'alarm-clock',
    iconSize: 16,
    placeholder: 'اختر الوقت',
    format: formatTwelveHourTime,
  },
};

const APPEARANCE_CLASSES: Record<SendMomentAppearance, { label: string; box: string }> = {
  outlined: {
    label: 'text-[12px]/[16px] font-medium text-text-secondary',
    box: 'h-11 border-text-secondary bg-white',
  },
  filled: {
    label: 'text-[11px]/[14px] text-[#717784]',
    box: 'h-10 border-border bg-[#f2f4f6]',
  },
};

/**
 * Shows the pick as the designs write it ("05/18/2026", "08:00 PM") whatever the browser locale,
 * with the native input laid invisibly over the box so the system picker still does the picking.
 */
@Component({
  selector: 'app-send-moment-field',
  imports: [AppIcon],
  templateUrl: './send-moment-field.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendMomentField {
  readonly kind = input.required<SendMomentKind>();
  readonly label = input.required<string>();
  /** `yyyy-mm-dd` for a date, `hh:mm` for a time. */
  readonly value = input<string | null>(null);
  readonly appearance = input<SendMomentAppearance>('outlined');
  readonly valueChange = output<string | null>();

  protected readonly skin = computed(() => KIND_SKINS[this.kind()]);
  protected readonly classes = computed(() => APPEARANCE_CLASSES[this.appearance()]);
  protected readonly isIconShown = computed(() => this.appearance() === 'outlined');
  protected readonly text = computed(() => {
    const value = this.value();
    return value ? this.skin().format(value) : null;
  });

  protected onChange(event: Event): void {
    const picked = (event.target as HTMLInputElement).value;
    this.valueChange.emit(picked === '' ? null : picked);
  }

  /** Chromium only opens the picker from its own small icon, so a click anywhere asks for it. */
  protected openPicker(event: Event): void {
    try {
      (event.target as HTMLInputElement).showPicker();
    } catch {
      // Browsers without `showPicker` fall back to their own behaviour.
    }
  }
}
