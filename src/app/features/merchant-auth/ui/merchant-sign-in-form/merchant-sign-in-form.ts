import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MERCHANT_SUPPORT_URL } from '../../../../core/config/merchant-support-url';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { createSignInForm, describeSignInProblem } from '../../../auth/forms/sign-in-form';
import { AuthFormError } from '../../../auth/ui/auth-form-error/auth-form-error';
import { AuthHeading } from '../../../auth/ui/auth-heading/auth-heading';
import { AuthPasswordField } from '../../../auth/ui/auth-password-field/auth-password-field';
import { AuthSubmitButton } from '../../../auth/ui/auth-submit-button/auth-submit-button';
import { AuthTextField } from '../../../auth/ui/auth-text-field/auth-text-field';
import { MERCHANT_AUTH_ROUTES } from '../../merchant-auth-paths';
import { MerchantAuthStore } from '../../state/merchant-auth.store';

/** The "حساب المتجر" tab of /login, as the merchant login frame draws it. */
@Component({
  selector: 'app-merchant-sign-in-form',
  imports: [
    AppIcon,
    AuthFormError,
    AuthHeading,
    AuthPasswordField,
    AuthSubmitButton,
    AuthTextField,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './merchant-sign-in-form.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantSignInForm {
  protected readonly store = inject(MerchantAuthStore);
  protected readonly supportUrl = inject(MERCHANT_SUPPORT_URL);
  protected readonly routes = MERCHANT_AUTH_ROUTES;
  protected readonly form = createSignInForm();

  private readonly validationMessage = signal<string | null>(null);
  protected readonly errorMessage = computed(() => this.validationMessage() ?? this.store.error());

  constructor() {
    this.store.startReset();
  }

  protected submit(): void {
    const problem = describeSignInProblem(this.form);
    this.validationMessage.set(problem);
    if (!problem) {
      this.store.signIn(this.form.getRawValue());
    }
  }
}
