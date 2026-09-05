import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  templateUrl: './toggle-switch.html',
  host: { class: 'inline-flex' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleSwitch {
  readonly isOn = input.required<boolean>();
  readonly label = input<string>('');
  readonly toggled = output<boolean>();
}
