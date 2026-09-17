import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

/** The 40px blue add button beside a settings section title, smaller than the page one. */
@Component({
  selector: 'app-settings-add-button',
  imports: [AppIcon],
  templateUrl: './settings-add-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsAddButton {
  readonly label = input.required<string>();
  readonly pressed = output<void>();
}
