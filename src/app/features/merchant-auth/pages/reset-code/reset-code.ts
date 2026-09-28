import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { INCOMPLETE_CODE_MESSAGE } from '../../forms/merchant-auth-messages';
import { RESET_CODE_LENGTH } from '../../forms/reset-code-digits';
import { MERCHANT_AUTH_ROUTES } from '../../merchant-auth-paths';
import { MerchantAuthStore } from '../../state/merchant-auth.store';
import { AuthFormError } from '../../../auth/ui/auth-form-error/auth-form-error';
import { AuthFormFrame } from '../../../auth/ui/auth-form-frame/auth-form-frame';
import { AuthHeading } from '../../../auth/ui/auth-heading/auth-heading';
import { AuthSubmitButton } from '../../../auth/ui/auth-submit-button/auth-submit-button';
import { ResetCodeField } from '../../ui/reset-code-field/reset-code-field';

@Component({
  selector: 'app-reset-code',
  imports: [
    AuthFormError,
    AuthFormFrame,
    AuthHeading,
    AuthSubmitButton,
    ReactiveFormsModule,
    ResetCodeField,
  ],
  templateUrl: './reset-code.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetCode {
  private readonly router = inject(Router);
  protected readonly store = inject(MerchantAuthStore);
  protected readonly routes = MERCHANT_AUTH_ROUTES;

  protected readonly form = new FormGroup({ code: new FormControl('', { nonNullable: true }) });

  private readonly validationMessage = signal<string | null>(null);
  protected readonly errorMessage = computed(() => this.validationMessage() ?? this.store.error());

  constructor() {
    this.store.clearError();
    effect(() => {
      if (this.store.resetStep() === 'password') {
        this.router.navigateByUrl(MERCHANT_AUTH_ROUTES.newPassword);
      }
    });
  }

  protected resend(): void {
    this.validationMessage.set(null);
    this.form.reset();
    this.store.resendResetCode();
  }

  protected submit(): void {
    const { code } = this.form.controls;
    if (code.value.length !== RESET_CODE_LENGTH) {
      this.validationMessage.set(INCOMPLETE_CODE_MESSAGE);
      return;
    }
    this.validationMessage.set(null);
    this.store.verifyResetCode(code.value);
  }
}
