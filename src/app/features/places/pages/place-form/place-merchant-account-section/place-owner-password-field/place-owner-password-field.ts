import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { createRandomPassword } from '../../../../../../shared/security/random-password';
import { AppIcon } from '../../../../../../shared/ui/app-icon/app-icon';
import { FieldLabel } from '../../../../../../shared/ui/field-label/field-label';
import { PasswordVisibilityToggle } from '../../../../../../shared/ui/password-visibility-toggle/password-visibility-toggle';
import { PlaceFieldControl } from '../../../../ui/place-field-control';

const EYE_ICON_SIZE_PX = 20;
const KEEP_PASSWORD_HINT = 'اتركها فارغة للإبقاء على كلمة المرور الحالية';

/** The merchant password: hidden by default, with an eye to show it and a button to make one. */
@Component({
  selector: 'app-place-owner-password-field',
  imports: [AppIcon, FieldLabel, PasswordVisibilityToggle, PlaceFieldControl, ReactiveFormsModule],
  templateUrl: './place-owner-password-field.html',
  host: { class: 'flex flex-col gap-1' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceOwnerPasswordField {
  readonly control = input.required<FormControl<string>>();
  /** An edit keeps the saved password, so the field is not required there. */
  readonly isEditing = input<boolean>(false);

  protected readonly isPasswordVisible = signal(false);
  protected readonly eyeIconSize = EYE_ICON_SIZE_PX;
  protected readonly placeholder = computed(() => (this.isEditing() ? KEEP_PASSWORD_HINT : null));

  /** The new password is shown at once, so the admin can read it out or copy it to the merchant. */
  protected generatePassword(): void {
    const control = this.control();
    control.setValue(createRandomPassword());
    control.markAsDirty();
    control.markAsTouched();
    this.isPasswordVisible.set(true);
  }
}
