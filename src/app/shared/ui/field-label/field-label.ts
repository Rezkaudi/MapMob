import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-field-label',
  templateUrl: './field-label.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldLabel {
  readonly text = input.required<string>();
  readonly forId = input<string>('');
  readonly isRequired = input<boolean>(false);
}
