import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PasswordVisibilityToggle } from '../../../../shared/ui/password-visibility-toggle/password-visibility-toggle';
import { SETTINGS_PASSWORD_INPUT_CLASSES } from '../settings-control-classes';
import { SettingsField } from '../settings-field/settings-field';

const PASSWORD_PLACEHOLDER = '••••••••••••';

@Component({
  selector: 'app-settings-password-field',
  imports: [PasswordVisibilityToggle, ReactiveFormsModule, SettingsField],
  templateUrl: './settings-password-field.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPasswordField {
  readonly label = input.required<string>();
  readonly fieldId = input.required<string>();
  readonly control = input.required<FormControl<string>>();
  readonly autocomplete = input<'current-password' | 'new-password'>('current-password');
  readonly error = input<string | null>(null);

  protected readonly placeholder = PASSWORD_PLACEHOLDER;
  protected readonly inputClasses = SETTINGS_PASSWORD_INPUT_CLASSES;
  protected readonly isPasswordVisible = signal(false);
}
