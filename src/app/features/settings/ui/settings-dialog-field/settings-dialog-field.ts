import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

/** A bold dialog label with its red star over an outlined 38px control. */
@Component({
  selector: 'app-settings-dialog-field',
  imports: [AppIcon],
  templateUrl: './settings-dialog-field.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsDialogField {
  readonly label = input.required<string>();
  readonly fieldId = input.required<string>();
  readonly isRequired = input<boolean>(true);
  /** Draws the down chevron a native select needs on its left edge. */
  readonly hasChevron = input<boolean>(false);
  readonly error = input<string | null>(null);
}
