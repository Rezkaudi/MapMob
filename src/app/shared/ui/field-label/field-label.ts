import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** `compact` is the product dialog's 12/16 label; `regular` the place form's 14/14 one. */
export type FieldLabelSize = 'regular' | 'compact';

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
  /** Adds the design's "(اختياري)" note for fields that may be left empty. */
  readonly isOptional = input<boolean>(false);
  readonly size = input<FieldLabelSize>('regular');
}
