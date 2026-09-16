import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DATE_PERIOD_LABEL, DatePeriod } from '../../models/date-period';
import { DateRange } from '../../models/date-range';
import { AppIcon } from '../app-icon/app-icon';
import { DateRangeFields } from '../date-range-fields/date-range-fields';

const PERIODS = Object.keys(DATE_PERIOD_LABEL) as DatePeriod[];
const PICKED_PRESET = 'bg-primary font-medium text-white';
const IDLE_PRESET = 'bg-[#f1f5f9] text-text-secondary hover:text-text-primary';

/** The period presets and the custom range the users and reviews filter panels share. */
@Component({
  selector: 'app-date-period-filter',
  imports: [AppIcon, DateRangeFields],
  templateUrl: './date-period-filter.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePeriodFilter {
  readonly heading = input.required<string>();
  readonly headingIcon = input<string | null>(null);
  readonly hasFixedWidthFields = input<boolean>(false);
  readonly period = input.required<DatePeriod>();
  readonly customRange = input.required<DateRange>();
  readonly periodChange = output<DatePeriod>();
  readonly customRangeChange = output<DateRange>();

  protected readonly isCustom = computed(() => this.period() === 'custom');
  protected readonly presets = computed(() =>
    PERIODS.map((period) => ({
      period,
      label: DATE_PERIOD_LABEL[period],
      isPicked: period === this.period(),
      classes: period === this.period() ? PICKED_PRESET : IDLE_PRESET,
    })),
  );
}
