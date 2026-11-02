import { AbstractControl } from '@angular/forms';

/** The merchant signs in with the email or phone, so both are set once when the place is added. */
export function lockOwnerSignInWhenEditing(control: AbstractControl, isEditing: boolean): void {
  if (isEditing) {
    control.disable({ emitEvent: false });
    return;
  }
  control.enable({ emitEvent: false });
}
