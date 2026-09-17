import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** The 18px title and 12px description over each settings section. */
@Component({
  selector: 'app-settings-section-heading',
  templateUrl: './settings-section-heading.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSectionHeading {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
