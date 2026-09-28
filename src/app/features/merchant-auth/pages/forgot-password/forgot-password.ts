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
import { INVALID_EMAIL_MESSAGE } from '../../../auth/forms/sign-in-messages';
import { MERCHANT_AUTH_ROUTES } from '../../merchant-auth-paths';
import { MerchantAuthStore } from '../../state/merchant-auth.store';
import { AuthFormError } from '../../../auth/ui/auth-form-error/auth-form-error';
import { AuthFormFrame } from '../../../auth/ui/auth-form-frame/auth-form-frame';
import { AuthHeading } from '../../../auth/ui/auth-heading/auth-heading';
import { AuthSubmitButton } from '../../../auth/ui/auth-submit-button/auth-submit-button';
import { AuthTextField } from '../../../auth/ui/auth-text-field/auth-text-field';

@Component({
  selector: 'app-forgot-password',
  imports: [
    AuthFormError,
    AuthFormFrame,
    AuthHeading,
    AuthSubmitButton,
    AuthTextField,
    ReactiveFormsModule,
  ],
  templateUrl: './forgot-password.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPassword {
  private readonly router = inject(Router);
  protected readonly store = inject(MerchantAuthStore);
  protected readonly routes = MERCHANT_AUTH_ROUTES;

  protected readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  private readonly validationMessage = signal<string | null>(null);
  protected readonly errorMessage = computed(() => this.validationMessage() ?? this.store.error());

  constructor() {
    this.store.startReset();
    effect(() => {
      if (this.store.resetStep() === 'code') {
        this.router.navigateByUrl(MERCHANT_AUTH_ROUTES.resetCode);
      }
    });
  }

  protected submit(): void {
    const { email } = this.form.controls;
    if (email.invalid) {
      this.validationMessage.set(INVALID_EMAIL_MESSAGE);
      return;
    }
    this.validationMessage.set(null);
    this.store.sendResetCode(email.value.trim());
  }
}
