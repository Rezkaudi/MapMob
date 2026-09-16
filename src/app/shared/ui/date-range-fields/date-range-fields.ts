import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { describeDateRange } from '../../formatting/date-range-summary';
import { DateRange } from '../../models/date-range';
import { DateField } from '../date-field/date-field';

const MISSING_RANGE_HINT = 'اختر بداية الفترة ونهايتها';
/** The reviews and ads designs keep each field 114px wide and push them to both edges. */
const FIXED_WIDTH_FIELD = 'w-[114px]';
const FILL_WIDTH_FIELD = 'min-w-0 flex-1';

/** The grey box with "من تاريخ" and "إلى تاريخ" and the sentence that sums the range up. */
@Component({
  selector: 'app-date-range-fields',
  imports: [DateField],
  templateUrl: './date-range-fields.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangeFields {
  readonly range = input.required<DateRange>();
  readonly hasFixedWidthFields = input<boolean>(false);
  readonly rangeChange = output<DateRange>();

  protected readonly summary = computed(
    () => describeDateRange(this.range()) ?? MISSING_RANGE_HINT,
  );
  protected readonly fieldClasses = computed(() =>
    this.hasFixedWidthFields() ? FIXED_WIDTH_FIELD : FILL_WIDTH_FIELD,
  );

  protected changeFrom(from: string | null): void {
    this.rangeChange.emit({ ...this.range(), from });
  }

  protected changeTo(to: string | null): void {
    this.rangeChange.emit({ ...this.range(), to });
  }
}
