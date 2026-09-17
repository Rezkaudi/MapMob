import { AbstractControl } from '@angular/forms';

/** The message under a field, shown only once the admin has been there or pressed save. */
export function touchedError(control: AbstractControl, message: string): string | null {
  return control.touched && control.invalid ? message : null;
}
