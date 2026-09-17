import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** A label with its red star, the projected control, then either the hint or the error. */
@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormField {
  readonly label = input.required<string>();
  readonly forId = input<string>('');
  readonly isRequired = input<boolean>(false);
  /** The ad form writes its labels in bold; the offer form does not. */
  readonly isLabelBold = input<boolean>(false);
  readonly hint = input<string>('');
  /** A character count such as "60/0", drawn at the far end of the label row. */
  readonly counter = input<string>('');
  readonly error = input<string | null>(null);
}
