import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { DateRange } from '../../models/date-range';
import { REGISTRATION_PERIOD_LABEL, RegistrationPeriod } from '../../models/registration-period';
import { DateField } from '../date-field/date-field';
import { describeDateRange } from '../user-filter-panel/date-range-summary';

const PERIODS = Object.keys(REGISTRATION_PERIOD_LABEL) as RegistrationPeriod[];
const PICKED_PRESET = 'bg-primary font-medium text-white';
const IDLE_PRESET = 'bg-[#f1f5f9] text-text-secondary hover:text-text-primary';

@Component({
  selector: 'app-registration-date-filter',
  imports: [AppIcon, DateField],
  templateUrl: './registration-date-filter.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationDateFilter {
  readonly period = input.required<RegistrationPeriod>();
  readonly customRange = input.required<DateRange>();
  readonly periodChange = output<RegistrationPeriod>();
  readonly customRangeChange = output<DateRange>();

  protected readonly isCustom = computed(() => this.period() === 'custom');
  protected readonly rangeSummary = computed(() => describeDateRange(this.customRange()));
  protected readonly presets = computed(() =>
    PERIODS.map((period) => ({
      period,
      label: REGISTRATION_PERIOD_LABEL[period],
      isPicked: period === this.period(),
      classes: period === this.period() ? PICKED_PRESET : IDLE_PRESET,
    })),
  );

  protected changeFrom(from: string | null): void {
    this.customRangeChange.emit({ ...this.customRange(), from });
  }

  protected changeTo(to: string | null): void {
    this.customRangeChange.emit({ ...this.customRange(), to });
  }
}
