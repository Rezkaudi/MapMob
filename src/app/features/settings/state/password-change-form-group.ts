import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { PasswordChange } from '../models/password-change';

export const PASSWORD_MIN_LENGTH = 8;

interface PasswordChangeFormValue extends PasswordChange {
  readonly confirmPassword: string;
}

function matchesNewPassword(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.parent?.get('newPassword')?.value;
  return control.value === newPassword ? null : { passwordMismatch: true };
}

export function createPasswordChangeFormGroup() {
  const form = new FormGroup({
    currentPassword: new FormControl('', { nonNullable: true, validators: Validators.required }),
    newPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, matchesNewPassword],
    }),
  });
  form.controls.newPassword.valueChanges.subscribe(() =>
    form.controls.confirmPassword.updateValueAndValidity({ emitEvent: false }),
  );
  return form;
}

export function toPasswordChange({
  currentPassword,
  newPassword,
}: PasswordChangeFormValue): PasswordChange {
  return { currentPassword, newPassword };
}
