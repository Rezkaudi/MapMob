import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ToggleSwitch } from '../../../../shared/ui/toggle-switch/toggle-switch';
import { WeekDay } from '../../models/week-day';
import { WorkingDayRow as WorkingDayRowModel } from '../../models/working-day-row';
import { StoreCard } from '../store-card/store-card';
import { DayTimeChange, WorkingDayRow } from '../working-day-row/working-day-row';

export interface WeekDayTimeChange extends DayTimeChange {
  readonly day: WeekDay;
}

@Component({
  selector: 'app-store-hours-card',
  imports: [StoreCard, ToggleSwitch, WorkingDayRow],
  templateUrl: './store-hours-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreHoursCard {
  readonly rows = input.required<readonly WorkingDayRowModel[]>();
  readonly isOpen24Hours = input.required<boolean>();
  readonly allDayToggled = output<boolean>();
  readonly dayOpened = output<WeekDay>();
  readonly dayClosed = output<WeekDay>();
  readonly timeChanged = output<WeekDayTimeChange>();
}
