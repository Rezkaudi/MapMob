import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WorkingDayRow as WorkingDayRowModel } from '../../models/working-day-row';
import { DayTimeField } from '../../state/working-week-editing';
import { TimeChip } from '../time-chip/time-chip';

export interface DayTimeChange {
  readonly field: DayTimeField;
  readonly time: string;
}

/** One grey line of the hours card: day, hours, then the open/closed button. */
@Component({
  selector: 'li[app-working-day-row]',
  imports: [TimeChip],
  templateUrl: './working-day-row.html',
  host: { class: 'flex items-center justify-between gap-4 rounded bg-[#f2f4f6] p-3' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkingDayRow {
  readonly row = input.required<WorkingDayRowModel>();
  readonly isOpen24Hours = input<boolean>(false);
  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly timeChanged = output<DayTimeChange>();

  protected toggleDay(): void {
    if (this.row().isOpen) {
      this.closed.emit();
      return;
    }
    this.opened.emit();
  }
}
