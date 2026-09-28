import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import {
  AUTH_FIELD_BOX_CLASSES,
  AUTH_FIELD_INPUT_CLASSES,
  AUTH_FIELD_LABEL_CLASSES,
} from '../auth-field-classes';

const PASSWORD_PLACEHOLDER = '12345678';

@Component({
  selector: 'app-auth-password-field',
  imports: [AppIcon, ReactiveFormsModule],
  templateUrl: './auth-password-field.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPasswordField {
  readonly label = input.required<string>();
  readonly inputId = input.required<string>();
  readonly control = input.required<FormControl<string>>();
  readonly autocomplete = input<'current-password' | 'new-password'>('current-password');

  protected readonly placeholder = PASSWORD_PLACEHOLDER;
  protected readonly boxClasses = AUTH_FIELD_BOX_CLASSES;
  protected readonly inputClasses = AUTH_FIELD_INPUT_CLASSES;
  protected readonly labelClasses = AUTH_FIELD_LABEL_CLASSES;

  protected readonly isPasswordVisible = signal(false);
  protected readonly toggleLabel = computed(() =>
    this.isPasswordVisible() ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور',
  );

  protected togglePasswordVisibility(): void {
    this.isPasswordVisible.update((isVisible) => !isVisible);
  }
}
