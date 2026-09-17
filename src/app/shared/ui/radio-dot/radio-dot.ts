import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** The radio circle the option cards and the notification timing card draw. */
@Component({
  selector: 'app-radio-dot',
  templateUrl: './radio-dot.html',
  host: { class: 'flex shrink-0' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioDot {
  readonly isChecked = input.required<boolean>();
}
