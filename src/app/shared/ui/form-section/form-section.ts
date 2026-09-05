import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

/** One card of the place form: an amber-headed panel with the fields inside. */
@Component({
  selector: 'app-form-section',
  imports: [AppIcon],
  templateUrl: './form-section.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSection {
  readonly heading = input.required<string>();
  readonly icon = input.required<string>();
}
