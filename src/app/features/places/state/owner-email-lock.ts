import { AbstractControl } from '@angular/forms';

/** The merchant email is their sign-in, so it is set once when the place is added. */
export function lockOwnerEmailWhenEditing(control: AbstractControl, isEditing: boolean): void {
  if (isEditing) {
    control.disable({ emitEvent: false });
    return;
  }
  control.enable({ emitEvent: false });
}
