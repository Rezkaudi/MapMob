import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { touchedError } from '../../../../shared/forms/touched-error';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { Toast } from '../../../../shared/ui/toast/toast';
import { AuthStore } from '../../../auth/state/auth.store';
import { AccountSettingsStore } from '../../state/account-settings.store';
import {
  createAccountProfileFormGroup,
  toAccountProfileDraft,
} from '../../state/account-profile-form-group';
import {
  createPasswordChangeFormGroup,
  toPasswordChange,
} from '../../state/password-change-form-group';
import { SettingsCard } from '../../ui/settings-card/settings-card';
import {
  SETTINGS_INPUT_CLASSES,
  SETTINGS_INPUT_WITH_ICON_CLASSES,
  SETTINGS_SUBMIT_BUTTON_CLASSES,
} from '../../ui/settings-control-classes';
import { SettingsField } from '../../ui/settings-field/settings-field';
import { SettingsSectionHeading } from '../../ui/settings-section-heading/settings-section-heading';
import { SignOutPanel } from '../../ui/sign-out-panel/sign-out-panel';
import {
  ACCOUNT_FAILED_TITLES,
  ACCOUNT_FIELD_MESSAGES,
  ACCOUNT_SAVED_COPY,
} from './account-settings-copy';

const LOGIN_URL = '/login';

@Component({
  selector: 'app-account-settings',
  imports: [
    ErrorState,
    ReactiveFormsModule,
    SettingsCard,
    SettingsField,
    SettingsSectionHeading,
    SignOutPanel,
    Toast,
  ],
  templateUrl: './account-settings.html',
  providers: [AccountSettingsStore],
  host: { class: 'flex flex-col gap-6' },
  // Field errors read the forms' touched state, which signals do not track.
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AccountSettings {
  protected readonly store = inject(AccountSettingsStore);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly profileForm = createAccountProfileFormGroup();
  protected readonly passwordForm = createPasswordChangeFormGroup();
  protected readonly inputClasses = SETTINGS_INPUT_CLASSES;
  protected readonly inputWithIconClasses = SETTINGS_INPUT_WITH_ICON_CLASSES;
  protected readonly submitButtonClasses = SETTINGS_SUBMIT_BUTTON_CLASSES;
  protected readonly messages = ACCOUNT_FIELD_MESSAGES;

  protected readonly savedCopy = computed(() => {
    const form = this.store.savedForm();
    return form ? ACCOUNT_SAVED_COPY[form] : null;
  });
  protected readonly failedTitle = computed(() => {
    const form = this.store.failedForm();
    return form ? ACCOUNT_FAILED_TITLES[form] : null;
  });

  constructor() {
    this.store.loadProfile();
    effect(() => {
      const profile = this.store.profile();
      if (profile) {
        this.profileForm.reset({ fullName: profile.fullName, email: profile.email });
      }
    });
  }

  protected get newPasswordError(): string | null {
    const control = this.passwordForm.controls.newPassword;
    if (!control.touched || control.valid) {
      return null;
    }
    return control.hasError('required')
      ? this.messages.newPasswordRequired
      : this.messages.newPasswordTooShort;
  }

  protected get confirmPasswordError(): string | null {
    const control = this.passwordForm.controls.confirmPassword;
    if (!control.touched || control.valid) {
      return null;
    }
    return control.hasError('required')
      ? this.messages.confirmRequired
      : this.messages.confirmMismatch;
  }

  protected fieldError(control: 'fullName' | 'email'): string | null {
    return touchedError(this.profileForm.controls[control], this.messages[control]);
  }

  protected get currentPasswordError(): string | null {
    return touchedError(this.passwordForm.controls.currentPassword, this.messages.currentPassword);
  }

  protected saveProfile(): void {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.invalid) {
      return;
    }
    void this.store.saveProfile(toAccountProfileDraft(this.profileForm.getRawValue()));
  }

  protected async changePassword(): Promise<void> {
    this.passwordForm.markAllAsTouched();
    if (this.passwordForm.invalid) {
      return;
    }
    const isChanged = await this.store.changePassword(
      toPasswordChange(this.passwordForm.getRawValue()),
    );
    if (isChanged) {
      this.passwordForm.reset();
    }
  }

  protected signOut(): void {
    this.authStore.signOut();
    void this.router.navigateByUrl(LOGIN_URL);
  }
}
