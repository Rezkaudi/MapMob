import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** A bold 14px field label with an optional star and grey hint under it. */
@Component({
  selector: 'app-content-field-label',
  imports: [NgTemplateOutlet],
  templateUrl: './content-field-label.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentFieldLabel {
  readonly text = input.required<string>();
  /** Leave empty for a section heading that names a group of controls. */
  readonly forId = input<string>('');
  readonly isRequired = input<boolean>(false);
  readonly hint = input<string>('');
}
