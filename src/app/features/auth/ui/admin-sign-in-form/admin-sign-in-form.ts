import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { createSignInForm, describeSignInProblem } from '../../forms/sign-in-form';
import { AuthStore } from '../../state/auth.store';
import { AuthFormError } from '../auth-form-error/auth-form-error';
import { AuthHeading } from '../auth-heading/auth-heading';
import { AuthPasswordField } from '../auth-password-field/auth-password-field';
import { AuthSubmitButton } from '../auth-submit-button/auth-submit-button';
import { AuthTextField } from '../auth-text-field/auth-text-field';

/** The "حساب الإدارة" tab of /login. */
@Component({
  selector: 'app-admin-sign-in-form',
  imports: [
    AuthFormError,
    AuthHeading,
    AuthPasswordField,
    AuthSubmitButton,
    AuthTextField,
    ReactiveFormsModule,
  ],
  templateUrl: './admin-sign-in-form.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSignInForm {
  protected readonly store = inject(AuthStore);
  protected readonly form = createSignInForm();

  private readonly validationMessage = signal<string | null>(null);
  protected readonly errorMessage = computed(() => this.validationMessage() ?? this.store.error());

  constructor() {
    this.store.clearError();
  }

  protected submit(): void {
    const problem = describeSignInProblem(this.form);
    this.validationMessage.set(problem);
    if (!problem) {
      this.store.signIn(this.form.getRawValue());
    }
  }
}
