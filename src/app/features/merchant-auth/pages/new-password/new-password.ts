import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { matchingPasswordsValidator } from '../../forms/matching-passwords.validator';
import {
  MIN_PASSWORD_LENGTH,
  PASSWORDS_DIFFER_MESSAGE,
  SHORT_PASSWORD_MESSAGE,
} from '../../forms/merchant-auth-messages';
import { MERCHANT_AUTH_ROUTES } from '../../merchant-auth-paths';
import { MerchantAuthStore } from '../../state/merchant-auth.store';
import { AuthFormError } from '../../../auth/ui/auth-form-error/auth-form-error';
import { AuthFormFrame } from '../../../auth/ui/auth-form-frame/auth-form-frame';
import { AuthHeading } from '../../../auth/ui/auth-heading/auth-heading';
import { AuthPasswordField } from '../../../auth/ui/auth-password-field/auth-password-field';
import { AuthSubmitButton } from '../../../auth/ui/auth-submit-button/auth-submit-button';

@Component({
  selector: 'app-new-password',
  imports: [
    AuthFormError,
    AuthFormFrame,
    AuthHeading,
    AuthPasswordField,
    AuthSubmitButton,
    ReactiveFormsModule,
  ],
  templateUrl: './new-password.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPasswordPage {
  private readonly router = inject(Router);
  protected readonly store = inject(MerchantAuthStore);

  protected readonly form = new FormGroup(
    {
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(MIN_PASSWORD_LENGTH)],
      }),
      confirmation: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    },
    { validators: matchingPasswordsValidator('password', 'confirmation') },
  );

  private readonly validationMessage = signal<string | null>(null);
  protected readonly errorMessage = computed(() => this.validationMessage() ?? this.store.error());

  constructor() {
    this.store.clearError();
    effect(() => {
      if (this.store.resetStep() === 'done') {
        this.router.navigateByUrl(MERCHANT_AUTH_ROUTES.login);
      }
    });
  }

  protected submit(): void {
    const { password, confirmation } = this.form.controls;
    if (password.invalid) {
      this.validationMessage.set(SHORT_PASSWORD_MESSAGE);
      return;
    }
    if (confirmation.invalid || this.form.hasError('passwordsDiffer')) {
      this.validationMessage.set(PASSWORDS_DIFFER_MESSAGE);
      return;
    }
    this.validationMessage.set(null);
    this.store.resetPassword(password.value);
  }
}
