import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchingPasswordsValidator(
  passwordKey: string,
  confirmationKey: string,
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey)?.value;
    const confirmation = group.get(confirmationKey)?.value;
    if (!confirmation || password === confirmation) {
      return null;
    }
    return { passwordsDiffer: true };
  };
}
