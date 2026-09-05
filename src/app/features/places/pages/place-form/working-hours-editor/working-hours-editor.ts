import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ToggleSwitch } from '../../../../../shared/ui/toggle-switch/toggle-switch';
import { WorkingDay } from '../../../models/working-day';

@Component({
  selector: 'app-working-hours-editor',
  imports: [ToggleSwitch],
  templateUrl: './working-hours-editor.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkingHoursEditor {
  readonly week = input.required<readonly WorkingDay[]>();
  readonly weekChange = output<readonly WorkingDay[]>();

  protected patchDay(index: number, patch: Partial<WorkingDay>): void {
    this.weekChange.emit(
      this.week().map((day, position) => (position === index ? { ...day, ...patch } : day)),
    );
  }

  protected onTimeInput(index: number, field: 'opensAt' | 'closesAt', event: Event): void {
    this.patchDay(index, { [field]: (event.target as HTMLInputElement).value });
  }
}
