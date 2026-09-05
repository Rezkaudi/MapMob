import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';
import { SelectOption } from './select-option';

@Component({
  selector: 'app-select-field',
  imports: [AppIcon],
  templateUrl: './select-field.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectField {
  readonly placeholder = input<string>('');
  readonly options = input.required<readonly SelectOption[]>();
  readonly value = input<string | null>(null);
  readonly valueChange = output<string | null>();

  protected onChange(event: Event): void {
    const picked = (event.target as HTMLSelectElement).value;
    this.valueChange.emit(picked === '' ? null : picked);
  }
}
